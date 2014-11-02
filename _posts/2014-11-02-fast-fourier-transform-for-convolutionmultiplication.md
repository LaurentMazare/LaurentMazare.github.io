---
layout: post
title: "Fast Fourier Transform for Convolution/Multiplication"
description: ""
category: 
tags: []
---
{% include JB/setup %}
After hearing about it quite a few times, I finally took a couple hours to understand how to use the
[Fast Fourier Transform (FFT)]() to compute a [convolution](http://en.wikipedia.org/wiki/Convolution)
or the product of two arbitrary precision integers.

### The Convolution Problem

A discrete convolution is equivalent to computing the product of two polynomials: let us consider P and Q two
polynomials with integer coefficients.

$$ P(X) = \sum_{i=0}^p a_iX^i ~~~~ Q(X) = \sum_{i=0}^q b_iX^i$$

The product R of P and Q can be written as follows:

$$ R(X) = \sum_{i=0}^{p+q} \left( \sum_{j = 0}^i a_j b_{i-j} \right) X^i$$

As the index in the formula above may be out of bounds, we consider $$a_i = 0$$ for $$i > p$$ and $$b_i = 0$$ for $$i > q$$.
So the convolution/product problem consists in computing the coefficients $$c_i$$ of polynomial R.
A naive approach could do this with quadratic complexity.

Using polynomial multiplication, it is easy to implement integer multiplication in basis B. If $$a_i$$ is the representation
of an integer $$\alpha$$ in basis B and $$b_i$$ is the representation of $$\beta$$ in basis B. Then we have that:

$$ \alpha = \sum_{i=0}^p a_iB^i = P(B) ~~~~ \beta = \sum_{i=0}^q b_iB^i = Q(B)$$

And of the product of $$\alpha$$ and $$\beta$$ is given by:

$$\alpha\beta = \sum_{i=0}^{p+q} c_i B^i = R(B)$$

The coefficients $$c_i$$ are not necessary lower than B so we have to propagate a carry in order to normalize these coefficients,
e.g. this can be done with the following ocaml code for B equal to 10:

{% highlight ocaml %}
let propagate_carry c =
  let res, carry =
    List.fold_left
      (fun (acc, carry) c ->
        let tmp = carry + c in
        tmp mod 10 :: acc, tmp / 10)
      ([], 0)
      c
  in
  if carry <> 0 then carry :: res else res
{% endhighlight %}

### Polynomial Representations

In order to improve on the quadratic complexity of the naive approach, we will use a different representation for
polynomials. Rather than representing a polynomial $$P$$ of degree p by $$p+1$$ coefficients one can represent it as the value
for the polynomial on $$p+1$$ distinct complex numbers, e.g. P is represented by $$P(w_1)$$, $$P(w_2)$$, ... , $$P(w_{p+1})$$.

The immediate advantage is that multiplication of polynomials can be done pointwise: if we have the values $$p_i$$ taken
by P on $$p+q+1$$ points and we have the values $$q_i$$ taken by Q on the same points then the values $$r_i$$ taken
by R on these points are $$r_i = p_iq_i$$ so multiplication can now be done in linear time (we use $$p+q+1$$ points even
for P and Q representations as the degree of R is $$p+q$$).

The overall algorithm for the multiplication consists in generating $$p_i$$ and $$q_i$$ from $$a_i$$ and $$b_i$$. Then
we use $$r_i = p_iq_i$$ and we inverse the transformation, i.e. we compute the coefficients of R $$c_i$$ from the 
pointwise representation $$r_i$$.

The culprit is that switching between the coefficients and pointwise representations has some complexity cost.
However it turns out this can be done in $$O(n\log(n))$$ using FFT. If we assume that we already have an FFT algorithm
ready, then the overall algorithm is:
{% highlight ocaml %}
let mult a b =
  ...
  let a_fft = fft a 1 in
  let b_fft = fft b 1 in
  let c_fft = Array.init n (fun i -> Complex.mult a_fft.(i) b_fft.(i)) in
  let c = fft c_fft (-1) in
  ...
{% endhighlight %}
Where the second parameter for the *fft* function is 1 for the normal transformation and -1 if we want the inverse transformation.

### Fast Fourier Transform

The main idea of the Fourier transform of polynomial P of degree n is to compute the value of P on the
[n-th roots of unity](http://en.wikipedia.org/wiki/Root_of_unity), i.e. on $$\omega_k$$ for k between 0 and $$n-1$$ where:

$$\omega_k = \exp\left(\frac{2ik\pi}{n}\right)$$

In order to simplify things up, we consider in the following that n is a power of 2 strictly larger than the degree of P.
Then the trick of FFT is to compute $$P(\omega_k)$$ recursively on n by splitting P in two polynomials: $$P_1$$ for the even coefficients
of P and $$P_2$$ for the odd coefficients of P:

$$P(X) = \sum_{j=0}^n a_jX^j~~~~P_1(X) = \sum_{j=0}^{n/2} a_{2j}X^j~~~~P_2(X) = \sum_{j=0}^{n/2} a_{2j+1}X^j$$

It turns out that with this splitting, $$P(X) = P_1(X^2) + X.P_2(X^2)$$ so in particular:

$$P(\omega_k) = P_1(\omega_k^2) + \omega_k P_2(\omega_k^2)$$

We know see the structure of the recursive algorithm emerging: if $$\omega_k$$ is a n-th root of unity then
$$\omega_k^2$$ is a $$n/2$$-th root of unity. $$P_1$$ and $$P_2$$ have degree lower than or equal to $$n/2$$ so
we recursively compute the values of these polynomials on the $$n/2$$-th root of unity and we combine the
results to obtain $$P(\omega_k)$$.
The basis case where n is 1 corresponds to the constant polynomial, hence we return $$a_0$$ in this case.

Note that the procedure we described only works for k lower than $$n/2$$. However for k greater than or equal
to $$n/2$$ one could note that:

$$\omega_{k+n/2} = \exp\left(\frac{2ik\pi}{n}\right)\exp\left(i\pi\right) = -\omega_k$$

And so:

$$P(\omega_{k+n/2}) = P_1(\omega_k^2) - \omega_k P_2(\omega_k^2)$$

The following code implements the FFT algorithm in a naive way (some of the computations/allocations could
be reused).

{% highlight ocaml %}
(* Only works if the length of cs is a power of 2. *)
let rec fft cs sign =
  let n = Array.length cs in
  if n = 1 then cs
  else
    let cs1 = Array.init (n/2) (fun i -> cs.(2*i)) in
    let cs2 = Array.init (n/2) (fun i -> cs.(2*i+1)) in
    let es = fft cs1 sign in
    let ds = fft cs2 sign in
    let ww = Complex.exp_im(float sign *. 2.0 *. pi /. float n) in
    let res = Array.create n Complex.zero in
    let rec loop idx w =
      if idx = n/2 then ()
      else begin
        let es = es.(idx) in
        let ds = Complex.mult w ds.(idx) in
        res.(idx) <- Complex.add es ds;
        res.(idx + n/2) <- Complex.sub es ds;
        loop (idx + 1) (Complex.mult w ww)
      end
    in
    loop 0 Complex.one;
    res
{% endhighlight %}

*Inverse FFT: to be continued...*

### Ocaml Implementation

The ocaml code is summed up in this [gist](https://gist.github.com/LaurentMazare/f44160c91a5460be539a).
The implementation is very naive but should run in $$O(n\log(n))$$, there are lots of state of the art
implementation available, e.g. in [GMP](https://gmplib.org/).

It still seems not very intuitive to me that the best way to multiply integers is by using floats and the
cosine and sine functions (note that the algorithm can be adapted to use a finite field rather than complex
numbers so this removes float but computing roots of unity is less practical in this case).
