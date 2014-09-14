---
layout: post
title: "Counting Coprime Pairs"
description: ""
category: 
tags: []
---
{% include JB/setup %}
A classical problem consists in counting the number of pairs of coprime integer below some limit $$n$$. Let $$c(n)$$ be this number of pairs:

$$c(n) = \left| \left\{ (x, y) ~|~ \gcd(x, y) = 1,~ 1 \leq x, y \leq n \right\} \right|$$

The asymptotics of $$c(n)$$ can be found for example on [this wikipedia page](http://en.wikipedia.org/wiki/Coprime_integers#Probabilities): $$c(n) \sim n^2.6/\pi^2$$.  However we are interested in computing the exact value for $$c(n)$$.

### Brute-Force Approach

For small values of $$n$$, we could build all the pairs $$(x, y)$$ with $$1 \leq x, y\leq n$$ and compute the gcd using Euclid's algorithm. This would result in a complexity of $$O(n^2\log(n))$$.  The following Python snippet uses this method.

{% highlight python %}
def gcd(x, y): return x if y == 0 else gcd(y, x % y)
def c(n):
    return len([(x, y) for x in xrange(1, n+1) for y in xrange(1, n+1) if gcd(x, y) == 1])
{% endhighlight %}

A small improvement would be to use a [Stern-Brocot tree](http://laurentmazare.github.io/2013/07/20/using-the-stern-brocot-tree/) or the [Farey sequence](http://en.wikipedia.org/wiki/Farey_sequence).  This enables us to generate all the coprime pairs and so to count them with a quadratic complexity.

### Using Euler's Totient Function

In order to improve on the brute-force approach, we could use [Euler's totient function](http://en.wikipedia.org/wiki/Euler's_totient_function) $$\phi$$.  $$\phi(n)$$ is defined as the number of integers $$k$$ between $$1$$ and $$n$$ inclusive that are coprime with $$n$$.

It is very easy to compute $$\phi(n)$$ if we know the prime decomposition of $$n$$: if $$(p_i)_i$$ are distinct prime numbers,

$$\phi\left(\prod_{i = 1}^k p_i^{q_i}\right) = \prod_{i = 1}^k p_i^{q_i-1}(p_i-1)$$ 

There is a only a single coprime pair $$(x, y)$$ where $$x = y$$ and this pair is $$(1, 1)$$. By symmetry, $$c(n)$$ is twice the number of coprime pairs $$(x, y)$$ with $$x \leq y$$ minus one (as the pair $$(1, 1)$$ has been counted twice). By definition $$\phi(y)$$ is the number of coprime pairs $$(x, y)$$ with $$x \leq y$$ hence:

$$c(n) = 2 \sum_{k=1}^n \phi(n) - 1$$


This makes it possible to compute $$c(n)$$ more efficiently. We start by computing an Erathostene sieve for integers below $$n$$, this has complexity $$O(n\log(\log(n)))$$. Then for each integer $$k$$, we compute $$\phi(k)$$ by generating the prime decomposition of $$k$$ with complexity $$O(\log(k))$$ then applying the formula above. The overall complexity of this approach is $$O(n\log(n))$$.

This is implemented in python below. The sieve is not optimized at all, `fs[k]` stores a prime number that divides `k` so that it is easy to compute the prime decomposition of `k` recursively.

{% highlight python %}
def c(n):
    fs = [i for i in xrange(n+1)]
    for p in xrange(2, n+1):
        if fs[p] == p:
            pp = 2*p
            while pp <= n: fs[pp], pp = p, pp + p
    res = 0
    for k in xrange(1, n+1):
        phi = 1
        while k != 1:
            p, q = fs[k], 0
            while k % p == 0: k, q = k / p, q + 1
            phi *= (p - 1) * pow(p, q-1)
        res += phi
    return 2*res - 1
{% endhighlight %}

### Sublinear Algorithm

The previous algorithm has a linear space complexity so it could be used up to roughly $$10^8$$ but after that the memory consumption starts being an issue. Two simple observations make it possible to build an algorithm for $$c(n)$$ with a time complexity of $$O(n^\frac{3}{4})$$ and a space complexity of $$O(\sqrt{n})$$.

The first observation is that there are $$n^2$$ pairs $$(x, y)$$ with $$1 \leq x, y \leq n$$ (without any condition on their gcd) and these pairs can be partitioned according to their gcd values.

$$n^2 = \sum_{k=1}^n \left| \left\{ (x, y) ~|~ \gcd(x, y) = k,~ 1 \leq x, y \leq n \right\} \right|$$

Moreover, the set of pairs $$(x, y)$$ with $$\gcd(x, y) = k$$ and $$1 \leq x, y \leq n$$ can be put in bijection with the set of pairs $$(u, v)$$ with $$\gcd(u, v) = 1$$ and $$1 \leq ku, kv \leq n$$. Thus we obtain:

$$c\left(\left\lfloor \frac{n}{k} \right\rfloor\right) = \left| \left\{ (x, y) ~|~ \gcd(x, y) = k,~ 1 \leq x, y \leq n \right\} \right|$$

By combining these two results, we obtain the following recursive relation for $$c(n)$$:

$$c(n) = n^2 - \sum_{k=2}^n c\left(\left\lfloor \frac{n}{k} \right\rfloor\right)$$

Using this naively leads to an algorithm of linear complexity for both time and space. The second observation is that for $$k$$ ranging from $$1$$ to $$n$$, $$\lfloor n/k \rfloor$$ only takes roughly $$2\sqrt{n}$$ different values.

For $$k$$ between $$1$$ and $$\sqrt{n}$$, values for $$\lfloor n/k\rfloor$$ are distinct and greater than $$\sqrt{n}$$. For a target value $$m$$ between $$1$$ and $$\sqrt{n}$$, we have:

$$m \leq \frac{n}{k} < m+1$$

$$ \frac{n}{m+1} < k \leq \frac{n}{m}$$

So there are $$\lfloor n/m \rfloor - \lfloor n/(m+1) \rfloor$$ different values of $$k$$ for which $$\lfloor n/k\rfloor = m$$. Using this on the previous sum, we obtain:

$$c(n) = n^2
- \sum_{m=1}^{\lfloor \sqrt{n}\rfloor} c(m)\left(\left\lfloor \frac{n}{m} \right\rfloor - \left\lfloor \frac{n}{m+1} \right\rfloor\right)
- \sum_{k=2}^\alpha c\left(\left\lfloor \frac{n}{k} \right\rfloor\right)
$$

Where $$\alpha$$ is the largest integer such that $$\lfloor n/\alpha \rfloor > \sqrt{n}$$.
The code below implements this algorithm. For $$10^7$$ the returned value is 60792712854483 (which is identical to what was returned by the previous algorithm), for $$10^{10}$$ the returned value is 60792710185772432731 (unverified).


{% highlight python %}
from math import sqrt
def c(N):
  sqrt_N = int(sqrt(N))
  indexes = range(1, 1+sqrt_N)
  for k in xrange(sqrt_N, 0, -1):
    if indexes[-1] != N // k: indexes.append(N // k)
  res = {}
  for n in indexes:
    tmp = n ** 2
    if 1 < n:
      sqrt_n = int(sqrt(n))
      for l in xrange(1, sqrt_n+1):
        tmp -= res[l] * (n // l - n // (l+1))
      for d in xrange(2, 1 + n // (1 + sqrt_n)):
        tmp -= res[n // d]
    res[n] = tmp
  return res[N]
{% endhighlight %}
