---
layout: post
title: "Modular Exponentiation On Integers"
description: ""
category: 
tags: []
---
{% include JB/setup %}
Modular exponentiation consists in computing $$x^n(\textrm{mod}~ m)$$ given $$x$$, $$n$$, and $$m$$. The classical way to efficiently implement this is to use [exponentiation by squaring](http://en.wikipedia.org/wiki/Exponentiation_by_squaring).

### V1: A First Approach

The basic idea is to work recursively on $$n$$ using the following equations:

$$x^0 = 0,~x^{2n+1} = x^{2n}.x,~x^{2n} = (x^n)^2$$

This is quite straightforward to implement in ocaml using a recursive function, for example:

{% highlight ocaml %}
let rec pow ~mod_ x = function
| 0 -> 1
| n when n mod 2 = 0 ->
  let x = pow ~mod_ x (n/2) in
  (x * x) mod mod_
| n -> (pow ~mod_ x (n-1) * x) mod mod_
{% endhighlight %}

This code can also be found in module $$V1$$ of this [Gist](https://gist.github.com/LaurentMazare/6412582) along with a simple benchmark performing a million modular exponentiation on reasonably small numbers. On my small ChromeBook, it runs in 2.36 seconds. Note that complexity is in $$O(\log(n))$$, this function is not tail recursive but this is not much of an issue as the number of call is also bounded by $$\log(n)$$.

### V2: Variation on the equation

A first thing we could try to change is to replace our third equation, $$x^{2n} = (x^n)^2$$ with $$x^{2n} = (x^2)^n$$. This holds the following code, and the benchmark now runs in 2.02s.

{% highlight ocaml %}
let rec pow ~mod_ x = function
| 0 -> 1
| n when n mod 2 = 0 ->
  let x2 = (x * x) mod mod_ in
  pow ~mod_ (x2) (n/2) in
| n -> (pow ~mod_ x (n-1) * x) mod mod_
{% endhighlight %}

### V3: Use Bit Shifts

Instead of using the standard division and modulo operators, we can use the logical and to check if $$n$$ is even or odd, and a bit rotation to do the division by 2. $$V3$$ in this [Gist](https://gist.github.com/LaurentMazare/6412582) implements this change, the improvement is quite limited as the benchmark now runs in 2.00s.

### V4: Right-to-left Binary Method

An efficient variation of this is the [Right-to-left binary method](http://en.wikipedia.org/wiki/Modular_exponentiation#Right-to-left_binary_method). The idea is to build from the right to the left the binary digits $$n_i$$ of $$n$$. If $$n_i$$ is 0, then there is nothing to do, but if $$n_i$$ is 1 then we have to add $$x^{2^i}$$ to the current result. $$x^{2^i}$$ is iteratively built by squaring the previous value, i.e. if $$u_i = x^{2^i}$$, $$u_{i+1} = u_i^2$$. It is easily implemented using imperative code and very efficient as the benchmark now runs in 1.54s.

{% highlight ocaml %}
let pow ~mod_ x n =
  let x = ref x in
  let n = ref n in
  let res = ref 1 in
  while 0 <> !n do
    if !n land 1 = 1 then
    res := (!res * !x) mod mod_;
    n := !n asr 1;
    x := (!x * !x) mod mod_;
  done;
  !res
{% endhighlight %}

### V5: A Functional V4

The main loop of the previous version can easily be transformed in a tail-recursive function. This also avoids the use of references so it seems better when implementing this using ocaml. There is no major difference in terms of speed as the benchmark runs in 1.55s with this code.

{% highlight ocaml %}
let pow ~mod_ x n =
  let rec aux res x = function
  | 0 -> res
  | n ->
    let res =
      if n land 1 = 1 then (res * x) mod mod_
      else res
    in
    let x = (x * x) mod mod_ in
    aux res x (n asr 1)
  in
  aux 1 x n
{% endhighlight %}
