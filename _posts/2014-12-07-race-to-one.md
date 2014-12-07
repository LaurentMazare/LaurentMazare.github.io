---
layout: post
title: "Race to One"
description: ""
category: 
tags: []
---
{% include JB/setup %}
Here are two small probability puzzles. I believe the first one to be a 'classical' problem where a couple very different methods
can be used. The second puzzle appears to be a natural extension of the first one, I don't think I have ever seen any reference
to it anywhere.

#### Expected Time to Reach One

You start at position 0. At each turn you roll a 'continuous' dice that gives you a real number $$X$$ uniformly distributed between 0
and 1, if you were at position $$x$$ then you move to position $$x + X$$.

How many turns does it take on average to reach a position that is greater than 1 ?

#### Race to One

$$n$$ different players play the previous game alternatively: on each turn each player rolls the dice and move one after another.
The first player to reach a position greater than 1 wins. What is the probability for the first player to win ?

### Some Possible Solutions

#### Expected Time to Reach One

As usual in this kind of question, we can see that the position random variable is a Markov chain as it only depends on the previous
position. Let $$t(x)$$ be the expected number of turns that it takes to reach 1 starting at position $$x$$.
More formally if $$X_i$$ is the random variable for the i-th draw,

$$t(x) = \mathbb E\left[ \min \left\{ n | x + \sum_{i = 1}^n X_i > 1 \right\} \right]$$

This function is only defined between 0 and 1 and $$t(0)$$ is the answer to the
original question.  Then by looking at the impact of the first draw starting at
position $$x$$, if the draw returns a value $$y$$ greater than $$1-x$$ then we
are done, otherwise we continue from position $$x + y$$:

$$t(x) = 1 + \int_0^{1-x} t(x+y)dy = 1 + \int_x^1 t(y)dy$$

We can derive this equation to obtain a first-order differential equation $$t'(x) = -t(x)$$ and so we have that $$t(x) = \alpha\exp(-x)$$.
Moreover $$t(1) = 1$$ as we always win using a single roll starting from $$1$$. This gives
use $$\alpha = e$$, $$t(x) = \exp(1-x)$$ and so $$e(0) = e$$.

#### Race to One

Let $$p_m(x)$$ be the probability that $$m$$ rolls bring us at a position greater than 1 starting from position $$x$$, formally:

$$p_m(x) = \mathbb P\left[ x + \sum_{i = 1}^m X_i > 1 \right]$$

We have $$p_0(x) = 0$$. For $$m > 0$$, by looking again at the effect of X_1, we obtain:

$$p_m(x) = \int_0^{1-x} p_{m-1}(x+y)dy + \int_{1-x}^1 dy = x + \int_x^1 p_{m-1}(y)dy$$

Let us introduce the auxiliary function $$u_m(x) = p_m(1-x)$$ then we have:

$$u_m(x) = p_m(1-x) = 1-x + \int_{1-x}^1 p_{m-1}(y) dy = 1-x + \int_0^x u_{m-1}(z)dz$$

We have $$u_0(x) = 0$$, $$u_1(x) = 1-x$$, $$u_2(x) = 1-x+\int_0^x (1-y)dy = 1 - x^2 / 2$$ so our intuition is that
$$u_m(x) = 1 - x^m / m!$$. We can prove this by induction, let us consider $$m > 0$$:

$$u_m(x) = 1-x + \int_0^x \left(1-\frac{y^m}{m!}\right)dy = 1 - \frac{x^{m+1}}{(m+1)!}$$

And so we obtain $$p_m(0) = u_m(1) = 1 - 1 / m!$$. In order to simplify notations, in the following $$p_m$$ will stand for $$p_m(0)$$.
Let us introduce $$q_m$$ the probability to win in exactly $$m$$ turns, $$q_0 = q_1 = 0$$ and for $$m > 1$$:

$$q_m = p_m - p_{m-1} = 1 - \frac{1}{m!} - 1 + \frac{1}{(m-1)!} = \frac{m-1}{m!}$$

So the probability to win the *race* game in m turns for the first player is $$q_m(1-p_{m-1})^{n-1}$$: the first
player has to win in exactly m turns and all the other players must not have win in the $$m-1$$ previous
turns. Let p be the probability for the first player to win:

$$p = \sum_{m=2}^\infty \frac{m-1}{m!}\frac{1}{(m-1)!^{n-1}} = \sum_{m=2}^\infty \frac{m-1}{m}\frac{1}{(m-1)!^n}$$

In order to sanity check our answer, let us compare the theoretical result with
a Monte Carlo simulation over $$10^8$$ trajectories.

        |  n  |   Theoretical p   |  Monte Carlo result  |
        | --- |-------------------| -------------------- |
        |  2  |    0.6889484      |     0.688953         |
        |  3  |    0.5868639      |     0.586820         |
        |  4  |    0.5422478      |     0.542224         |
