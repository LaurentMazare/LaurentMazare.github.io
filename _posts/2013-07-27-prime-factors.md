---
layout: post
title: "Prime Factors"
description: ""
category: 
tags: []
---
{% include JB/setup %}
In the previous post, we used Erathostenes sieve to generate all the primes below a given limit $$N$$. Using a modified version of this sieve, we could compute for any integer below $$N$$ their prime decomposition. That is for any $$n < N$$ we produce the unique list $$(p_i, q_i)_i$$ such that $$(p_i)_i$$ is prime, $$p_i < p_{i+1}$$, and:

$$n = \prod_{i = 1}^{k} p_i^{q_i}$$

Using Erathostenes sieve, we created an array of booleans $$x_k$$ such that after applying the sieve, $$x_k$$ is set to true if and only if $$k$$ is prime. In this case, we create an array of integer $$f_k$$ such that $$f_k$$ is a prime factor of $$k$$. This array can be computed in a similar way as Erathostenes sieve:

* Create an integer array f of size N and initialize it to 0.
* For every integer n between $$2$$ and $$N-1$$, if $$f_n$$ is 0 then n is prime. In that case, set $$f_{mn}$$ to n for every m greater than 1.

Once the f array has been computed up to index n (inclusive), it is easy to obtain the prime decomposition of n recursively: we compute the prime decomposition of $$n / f_n$$ and then add the missing exponent.

We also use the sieve optimization from the previous post so that the f array can be produced in quasi-linear time. In this case, $$f_n$$ is a prime factor of $$2n+3$$ and powers of 2 have to be handled separately. This is done in the following snippet for generating the f array:

{% highlight ocaml %}
let factors max_n =
  let open Bigarray in
  let size = (max_n - 3) / 2 in
  let f = Array1.create int c_layout (size + 1) in
  for n = 0 to size do Array1.set f n 0 done;
  for n = 0 to size do
    if Array1.get f n = 0 then (
      let nn = 2 * n + 3 in
      Array1.set f n nn;
      let m_times_n = ref (2 * n * n + 6 * n + 3) in
      while !m_times_n < size do
        Array1.set f !m_times_n nn;
        m_times_n := !m_times_n + nn;
      done)
  done;
  f
{% endhighlight %}

For the prime decomposition function using the f array, note that we first introduce a function log_p that takes as input two integers n and p and returns a pair (q, m) such that $$n = p^qm$$ where q is maximized, or equivalently if p is prime, where m and p are coprime.

{% highlight ocaml %}
let dec f n =
  let rec log_p acc n p =
    if n mod p <> 0 then acc, n
    else log_p (acc + 1) (n / p) p
  in
  let rec aux acc n =
    if n = 1 then acc
    else
      let p = Bigarray.Array1.get f ((n-3)/2) in
      let q, n = log_p 0 n p in
      aux ((p, q) :: acc) n
  in
  let q2, n = log_p 0 n 2 in
  List.sort compare (aux (if q2 = 0 then [] else [2, q2]) n)
{% endhighlight %}

The complexity of this function is in $$O(\log(n)\log(\log(n)))$$ as it is mainly caused by the last sort operation.

An example of how to use these two functions together can be found in this [gist](https://gist.github.com/LaurentMazare/6073095). Performance-wise, the optimized sieve to generate all primes below $$10^8$$ took 1.2s on my ChromeBook. Generating the factors array on the same machine is significantly slower and takes 2.2s, this could be explained as the array is now 8 times larger than the previous array (using some int32 here would help).
