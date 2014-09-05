---
layout: post
title: "Using The Stern Brocot Tree"
description: ""
category: 
tags: []
---
{% include JB/setup %}
The method we used in the previous post to generate Pythagorean triples could be significantly improved. One of the main issues is that we are computing the GCD for all pairs $$(m, n)$$ and discarding pairs that are not coprime.

* Computing the GCD is done using Euclid''s algorithm which has complexity $O(log(n))$.
* The probability for a pair to be coprime is $$1/\zeta(2) \approx 0.61$$.

In order to improve this we could use a [Stern-Brocot tree](http://en.wikipedia.org/wiki/Stern-Brocot_tree). This tree gives a simple way to generate all coprime pairs under some limit. The Stern-Brocot generation works as follows, each node in the tree contains two pairs of coprime numbers. We start with a root node containing two pairs, (1, 0) and (1, 1). Expanding a node that contains pairs $$(m, n)$$ and $$(m', n')$$ leads to two new nodes, one containing $$(m, n)$$ and $$(m+n, m'+n')$$, the other one contains $$(m+n, m'+n')$$ and $$(m', n')$$. This process will generate in a unique way all pairs of coprime numbers $$(m, n)$$ with $$m \geq n$$.

A recursive way to generate all the coprime numbers would be:
{% highlight ocaml %}
let rec gen (m, n) (m', n') =
  let new_pair = (m + m', n + n') in
  (gen (m, n) new_pair) @ (gen new_pair (m', n'))
{% endhighlight %}

Of course this function would never terminate. It is also not tail recursive so quite likely to run out of memory on large inputs. Let us apply this to the Pythagorean triple generation:

{% highlight ocaml %}
let fold_sb init f max_s =
  let rec loop acc left_m left_n right_m right_n =
    let m = left_m + right_m in
    let n = left_n + right_n in
    let m2 = m * m in
    let mn = m * n in
    if max_s < 2 * (m2 + mn) then acc
    else
      let acc =
        if m land 1 = n land 1 then acc
        else
          let n2 = n * n in
          f acc (m2 - n2) (2 * mn) (m2 + n2)
      in
      loop (loop acc m n right_m right_n) left_m left_n m n
  in
  loop init 1 0 1 1
{% endhighlight %}

The gain of performance of this change compared to the previous method is quite impressive. When computing the number of Pythagorean triples under $$10^8$$, the computation is roughly 5 times faster. Computing the number of Pythagorean triples up to $$10^{10}$$ (14557915466) takes roughly 50 seconds on my ChromeBook.

An interesting point is that we have two possibilities to handle the non recursive part. We could write either of the two following lines:

{% highlight ocaml %}
loop (loop acc m n right_m right_n) left_m left_n m n
loop (loop acc left_m left_n m n) m n right_m right_n
{% endhighlight %}

The second line quickly leads to an out of memory crash: pairs of the form $$(1, n)$$ are coprime so this version generates all of them via the inner part of the loop that is not handled using tail-recursivity. However the first version does not suffer this issue and is able to work on a pretty large input.
