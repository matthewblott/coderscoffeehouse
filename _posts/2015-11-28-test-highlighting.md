---
layout: post
title:  "Test Highlighting"
date:   2015-11-28 19:15:00
categories: testing
---

{% highlight ruby linenos %}
def foo
  puts 'foo'
end
{% endhighlight %}

{% highlight vb linenos %}
Dim strSQL As String

strSQL = "SELECT ID, FirstName, LastName, CreatedDate, MofidifedDate " _
  "FROM ThisIsAnImpossiblyLongUsersTableName " _
  "WHERE ID = " & intID
{% endhighlight %}

{% highlight csharp linenos %}
public class MyClass
{
  public string SomeFunction(int id)
  {
    return id.ToString();
  }
}
{% endhighlight %}


