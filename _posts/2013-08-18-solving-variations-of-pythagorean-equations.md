---
layout: post
title: "Solving Variations Of Pythagorean Equations"
description: ""
category: 
tags: []
---
{% include JB/setup %}
In the [previous post](http://blog.mazare.fr/post/2013/08/03/Pythagorean-Triples-Again), we detailed a Pythagorean triple generator. The technique we used to prove it can be generalized to obtain generators solving other Diophantine equations. Let us illustrate this by giving a unique characterization of primitive triples (a, b, c) such that $$2a^2 + b^2 = c^2$$.

In a similar way as in the previous post, we define rational number $$\alpha = a/c$$, and (m, n) be the coprime pair such that:

$$\frac{b}{c} = 1 - \alpha\frac{m}{n}$$

Using this with the original equation, we obtain:

$$2\alpha^2 + \left(1 - \alpha\frac{m}{n}\right)^2 = 1$$

Simplifying this gives us the two following equations:

$$\alpha = \frac{a}{c} = \frac{2mn}{m^2+2n^2},~\frac{b}{c} = \frac{2n^2-m^2}{m^2+2n^2}$$

The following is slightly more involved than when generating Pythagorean triples. Let p be a common prime divisor of $$2mn$$ and $$m^2+2n^2$$. If p is different from 2, then p has to divide both m and n which is impossible. Hence the GCD g of $$2mn$$ and $$m^2+2n^2$$ is a power of 2 (which of course includes 1).

1. If g is equal to 1, then $$2mn$$ and $$m^2+2n^2$$ are coprime and so: $$a = 2mn$$, $$b=2n^2-m^2$$, and $$c=m^2+2n^2$$.
2. If g is even, then as it divides $$m^2+2n^2$$ we obtain that m is even too and so n is odd. Let us introduce $$m_2 = m^2/2$$. Then $$\frac{a}{c} = \frac{mn}{m_2+n^2}$$ and $$\frac{b}{c} = \frac{n^2-m_2}{m_2+n^2}$$. As m is even, $$m_2$$ is even and so $$m_2+n^2$$ and $$mn$$ are coprime (as the only common prime factor of $$2mn$$ and $$m^2+2n^2$$ is 2). So we obtain that $$a = mn$$, $$b=n^2-m_2$$, and $$c=m_2+n^2$$.

To sum this up, if (a, b, c) is a triple satisfying $$2a^2+b^2=c^2$$, then there exists a coprime pair (m, n) such that one of the two following equation holds.

$$a = 2mn,~ b=2n^2-m^2,~c=m^2+2n^2, ~\mbox{ with m odd}$$

$$a = mn,~ b=n^2-m_2,~c=m_2+n^2, ~\mbox{ with m even}$$

The converse of this characterization, i.e. checking that for any coprime pair (m, n) the generated a, b, and c, satisfy the original equation is quite easy if we add the restriction that $$2n^2 - m^2$$ is positive.

This characterization can be used to uniquely generate all the primitive triples (a, b, c) satisfying the original equation. This is illustrated in this [Gist snippet](https://gist.github.com/LaurentMazare/6263014) using ocaml. Using it, we can generate all these triples for $$a+b+c \leq 10^8$$ in a few seconds. This code is not very optimized as it does not use a Stern-Brocot tree to generate the (m, n) pairs. It has been checked against the brute-force approach for a+b+c up to $$10^4$$.
