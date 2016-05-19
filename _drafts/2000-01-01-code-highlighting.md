---
layout: post
title:  "Code Highlighting"
date:   2000-01-01 00:00:00
categories: tech
---

![](/path/image.jpg)
[href text](/path/to/page.html)

Some ```inline``` code.

{% highlight csharp linenos %}

void SomeMethod ()
{

}

{% endhighlight %}

{% highlight csharp linenos %}

<%@ Page AutoEventWireup="true" Language="C#" ContentType="text/plain" %>

<script runat="server">

  void Page_Load(object sender, EventArgs e)
  {
    this.Response.Write("Hello World!");
  }

</script>

{% endhighlight %}

{% highlight vb linenos %}

Sub SomeMethod ()

End Sub

{% endhighlight %}

{% highlight vbnet linenos %}
{% endhighlight %}

{% highlight shell linenos %}

sudo apt-get install openssh-server

{% endhighlight %}