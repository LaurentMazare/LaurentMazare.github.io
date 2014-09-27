---
layout: post
title: "Fixed Points Of Random Permutations"
description: ""
category: 
tags: []
---
{% include JB/setup %}
A *permutation* $$\sigma$$ of $$[1, n]$$ is a bijective function from $$[1, n]$$ to $$[1, n]$$. There are $$n!$$ different permutations of $$[1, n]$$, a random permutation is a random variable that can take as value any permutation with probability $$1/n!$$.

$$i$$ is a *fixed point* for permutation $$\sigma$$ if $$\sigma(i) = i$$. Three interesting questions concerning fixed points of a random permutation are:

1. What is the expected number of fixed points for a random permutation of $$[1, n]$$ ?
2. What is the probability for a random permutation of $$[1, n]$$ not to have any fixed point ?
3. What is the probability for a random permutation of $$[1, n]$$ to have $$k$$ fixed points ?

In the following let $$f(\sigma)$$ be the number of fixed point of $$\sigma$$ and let $$\sigma$$ be a random permutation.

### Expected Number of Fixed Points

Let us start with the definition of $$f$$. Linearity of the expected value makes solving this problem easy.

$$\mathbb E\left[f(\sigma)\right] = \mathbb E\left[\sum_{i=1}^n \mathbb 1_{\sigma(i) = i}\right] = \sum_{i=1}^n \mathbb E\left[1_{\sigma(i)=i}\right]$$

For each i, the probability for i to be a fixed point of $$\sigma$$ is the probability for $$\sigma(i)$$ to be equal to $$i$$ hence is equal to $$1/n$$.
Using this we obtain $$\mathbb E\left[f(\sigma)\right] = 1$$.

### Probability to Have No Fixed Point

A permutation with no fixed point is called a *derangement*. Let $$D_n$$ be the number of such derangements of $$[1, n]$$.

Consider a derangement $$\sigma$$ of $$[1, n]$$ with n greater than or equal to 2. There are $$n-1$$ possible choices for $$\sigma(1)$$. Then there are two distinct cases to consider:

- If $$\sigma(\sigma(1)) = 1$$ then $$\sigma$$ is a derangement over the set $$[1, n]$$ where both $$1$$ and $$\sigma(1)$$ has been removed. There are $$D_{n-2}$$ such derangements.
- If $$\sigma(\sigma(1)) \neq 1$$ then consider the function $$\sigma'$$ of $$[2, n]$$ such that $$\sigma'(k) = \sigma(k)$$ if $$\sigma(k) \neq 1$$ and $$\sigma'(k) = \sigma(1)$$ otherwise. Then $$\sigma'$$ is a permutation of $$[2, n]$$ and is a derangement, there are $$D_{n-1}$$ such derangements.

This gives us that $$D_n = (n-1)(D_{n-2} + D_{n-1})$$. It is worth noting that this recurrence relation is also satisfied by the factorial function, however $$1! = 1$$ whereas $$D_1 = 0$$. We can recombine this second-order recurrence relation in order to obtain a first-order recurrence relation as follows:

$$D_n - nD_{n-1} = (n-1)D_{n-2} - D_{n-1} = ... = (-1)^n (D_2 - D_1) = (-1)^n(1 - 0)$$

Hence we have that $$D_n = nD_{n-1} + (-1)^n$$. By dividing both side of the equations by $$n!$$ we obtain:

$$\frac{D_n}{n!} = \frac{D_{n-1}}{(n-1)!} + \frac{(-1)^n}{n!} = \sum_{k=0}^n \frac{(-1)^k}{k!}$$

The probability for a random permutation to be a derangement is $$D_n/n! = \sum_{k=0}^n (-1)^k/k!$$. When $$n$$ goes to infinity, this probability goes to $$1/e$$.

### Probability to Have k Fixed Points

This can be deduced from the probability for a permutation not to have fixed points. The number of permutations with k fixed points can be obtained by choosing these k points among n and noticing that the permutation is a derangement over the $$n-k$$ other points. Hence this number is $${n \choose k} D_{n-k}$$

The probability is then:

$$\mathbb P\left[ f(\sigma) = k \right] = \frac{ {n \choose k} (n-k)!\sum_{i=0}^{n-k} (-1)^i/i!}{n!} = \frac{\sum_{i=0}^{n-k} (-1)^i/i!}{k!}$$
