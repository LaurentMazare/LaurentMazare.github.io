---
layout: post
title: "Prime Sieving"
description: ""
category: 
tags: []
---
{% include JB/setup %}
A classical problem is to generate all the primes below a limit $$N$$. For example this could be used to efficiently compute the prime decomposition of a given integer. A very simple way to do that is to use an [Erathostenes Sieve](http://en.wikipedia.org/wiki/Erathostenes_sieve).

## Naive Erathostenes Sieve

The classical version of the algorithm works as follows:

* Create a boolean array $$p$$ of size $$N$$ and initialize it to *true*. $$p_n$$ represents whether integer $$n$$ is prime.
* For every integer $$n$$ between $$2$$ and $$N-1$$, if $$p_n$$ then set $$p_{mn}$$ to false for any integer $$m$$ greater than $$1$$ and lower than $$\lfloor N/n \rfloor$$.

Complexity of this algorithm is $$N/2 + N/3 + ... + N/p$$. As the prime density tends to $$\log(N)/N$$ where $$N$$ goes to infinity, this algorithm has complexity $$O(N\log(\log(N)))$$.

A straightforward imperative ocaml implementation of this using the bigarray module is given below. On my ChromeBook, it computes the sum of all primes below $$10^8$$ in 3.9 seconds, not to far from the C equivalent which runs in 3.3s on the same machine (ocaml is compiled in native code, C is compiled with gcc -O3).

{% highlight ocaml %}
let erathostene max_n =
  let open Bigarray in
  let p = Array1.create char c_layout max_n in
  for n = 2 to max_n - 1 do Array1.set p n 't' done;
  for n = 2 to max_n - 1 do
    if Array1.get p n = 't' then (
      let m_times_n = ref (n + n) in
      while !m_times_n < max_n do
        Array1.set p !m_times_n 'f';
        m_times_n := !m_times_n + n;
      done)
  done
{% endhighlight %}

There are two aspects that we may want to optimize: speed and memory consumption. For memory, we use $$N$$ bytes. A straightforward way to improve this is to use an array of bits, and also not to handle even numbers. This way, memory consumption would be down by a factor 16. Let us see how we can improve speed.

## Optimized Erathostenes Sieve

As for memory, a simple first optimization consists in not handling even numbers. Another straightforward improvement is that instead of setting all $$p_{mn}$$ to false for $$m > 1$$, we could do it only for $$m \geq n$$ (this is because integers $$mn$$ for $$m < n$$ have already been set to false in the step corresponding to the lowest prime factor of $$m$$). Using this version to sum primes up to $$10^8$$ runs in 1.2s using the following ocaml code, so three times faster than the naive approach. The same code in C runs just below a second, still on the same machine.

{% highlight ocaml %}
let erathostene max_n =
  let open Bigarray in
  let size = (max_n - 3) / 2 in
  let p = Array1.create char c_layout (size + 1) in
  for n = 0 to size do Array1.set p n 't' done;
  for n = 0 to size do
    if Array1.get p n = 't' then (
      let nn = 2 * n + 3 in
      let m_times_n = ref (2 * n * n + 6 * n + 3) in
      while !m_times_n < size do
        Array1.set p !m_times_n 'f';
        m_times_n := !m_times_n + nn;
      done)
  done
{% endhighlight %}

In order to understand the code above, note that $$p_n$$ is true now denotes that integer $$2n+3$$ is prime.

*This post was originally published in July 2013.*
