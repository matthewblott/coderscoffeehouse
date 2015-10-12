---
layout: post
title:  "SQL in VB .NET"
date:   2015-03-12 21:39:00
categories: vbnet sql
---
It's generally seen as a good rule of thumb to avoid writing inline SQL and it's a rule I try to observe - the obvious pitfall being it isn't parsed until runtime. Stored procedures can mitigate against this but I tend to avoid - with cached queries the advantage of compilation isn't there anymore and I find they add a layer of abstraction I don't want. So sometimes I find myself getting down and dirty with a bit of inline SQL.

Anyhow, I've noticed my style of writing inline SQL has changed over the years. The first real world programming I did was in VBA and like a lot of people at the time I employed the Hungarian convention. And impossibly long SQL statements would all be one long continuous string seperated on different lines with underscores.

{% highlight vbnet linenos %}
Dim strSQL As String

strSQL = "SELECT ID, FirstName, LastName, CreatedDate, MofidifedDate " _
  "FROM ThisIsAnImpossiblyLongUsersTableName " _
  "WHERE ID = " & intID
{% endhighlight %}

With the advent of .NET the Hungarian convention went out of fashion.  Code was more elegant and I found this was enhanced by concatenating the SQL string (I also learned to use a command object properly!).

{% highlight vbnet linenos %}

Dim sql = String.Empty

sql &= "SELECT Id, FirstName, LastName, CreatedDate, MofidifedDate "
sql &= "FROM ThisIsAnImpossiblyLongUsersTableName "
sql &= "WHERE Id = @Id "

{% endhighlight %}

And this approach served me for quite a while until recently. I don't do much VB.NET these days. In fact I code less on the .NET stack than I used to but when I do it's always C#. But I have legacy applications to support and sometimes there is a requirement for VB.NET. One of the things I like about C# is the ability to write multiline strings using the @ character.

{% highlight csharp linenos %}

var sql = @"

  select Id, FirstName, LastName, CreatedDate, MofidifedDate
  from ThisIsAnImpossiblyLongUsersTableName
  where Id = @Id ";

{% endhighlight %}

I found out you can do something similar to that above in VB.NET using Linq and XML. Import both the System.XML and System.XML.Linq namespaces and you can do the following.

{% highlight vbnet linenos %}

Dim sql = <sql>

  select Id, FirstName, LastName, CreatedDate, MofidifedDate
  from ThisIsAnImpossiblyLongUsersTableName
  where Id = @Id
  
  </sql>.Value

{% endhighlight %}

I didn't realise you could write inline XML and I think it's pretty cool - I've tried to do the same in C# and not been able to (if someone knows different please let me know). I find this really handy as I can now write very readable SQL statements which can be copied and pasted into SSMS easily if need be.
