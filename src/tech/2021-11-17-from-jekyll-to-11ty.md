---
eleventyExcludeFromCollections: true
layout: post.html
title: From Jekyll to 11ty
date: 2021-11-15
tags: tech
---

Here is the post

```shell

file=post10.md

sed -i '' 's/find string/replace string/g' $file

sed -i '' 's/layout: post/layout: base.html/g' $file
sed -i '' 's/categories: tech/tags: tech/g' $file

sed -i '' 's/{{ '{%' }} asset posts/![](\/assets\/img\/posts/g' $file
sed -i '' 's/.jpg %}/.jpg)/g' $file

sed -i '' 's/{{ '{%' }} highlight vb linenos %}/```/g' $file

sed -i '' 's/{{ '{%' }} highlight csharp linenos %}/```/g' $file

sed -i '' 's/{{ '{%' }} endhighlight %}/```/g' $file

```