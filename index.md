---
layout: page
title: Code and Numbers
tagline:
---
{% include JB/setup %}

<ul class="posts">
  {% for post in site.posts %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
    {{ post.excerpt }}
  {% endfor %}
</ul>

![ProjectEuler](http://projecteuler.net/profile/gawal.png)
