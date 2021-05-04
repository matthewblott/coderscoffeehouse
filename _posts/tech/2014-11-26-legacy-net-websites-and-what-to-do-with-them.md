---
layout: post
title:  "Legacy ASP.NET Websites"
date:   2014-11-26 20:38:00
# categories: web aspnet
categories: tech

# example {% asset posts/20171123/114511-xs.jpg %}

---

So, you've got an old ASP.NET website using the now (or so it seems) disliked Web Forms that really needs upgrading but you simply don't  have the time or resources to devote to the task. But making incremental changes with all the good new stuff is difficult because websites don't play as well with the VS tools like web projects do. Some problems:

* I am forced to convert a website to a web project - a bit of a task in itself as there is no natural converion method or tools to do this.

* My old site is problem enough so I want to be able to upload an .aspx page without having to build the whole site everytime I want to make a change - ASP.NET websites allow me to do this, projects do not. I also don't want to use a web project because I end up with all this in my file system.

{% asset posts/20141126/solution-explorer.jpg %}

The bloated solution VS creates that I have to pick through and then remove the bits I don't want (shouldn't it be the other way round?).

I just want to add the odd controller and build from there. And although it's not obvious it can be done.

Add the correct libraries. This took some effort as MVC uses a lot of extension methods so it isn't always apparent that the correct library is loaded. Also, the namespaces can be confusing - Microsoft.AspNet.Mvc and System.Web.Mvc both appear to be the same upon inspection. The files below are the only ones you will need.

{% asset posts/20141126/required-libraries.jpg %}

Add the correct handlers and assemblies to web.config. Needless to say when you install stuff via VS or Nuget you get a lot of unncessary boiler plate additions you can live without. Here is a barebones example of what you need in web.config.

{% highlight xml linenos %}

<?xml version="1.0"?>
  <system.web>
    <compilation targetFramework="4.5">
      <assemblies>
        <add assembly="System.Net.Http, Version=4.0.0.0, Culture=neutral, PublicKeyToken=B03F5F7F11D50A3A"/>
        <add assembly="System.Web.Mvc, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"/>
    </assemblies>
    </compilation>
  </system.web>
  <runtime>
    <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
      <dependentAssembly>
        <assemblyIdentity name="Newtonsoft.Json"
          publicKeyToken="30ad4fe6b2a6aeed" culture="neutral"/>
        <bindingRedirect oldVersion="0.0.0.0-6.0.0.0" newVersion="6.0.0.0"/>
      </dependentAssembly>
    </assemblyBinding>
  </runtime>
  <system.webServer>
    <handlers>
      <remove name="ExtensionlessUrlHandler-Integrated-4.0"/>
      <remove name="OPTIONSVerbHandler"/>
      <remove name="TRACEVerbHandler"/>
      <add name="ExtensionlessUrlHandler-Integrated-4.0" path="*."
        verb="*"type="System.Web.Handlers.TransferRequestHandler"
        preCondition="integratedMode,runtimeVersionv4.0"/>
    </handlers>
  </system.webServer>
</configuration>

{% endhighlight %}

Add the routes you want to use with your application. This one through me as the MapHttpRoute method is an extension method and it doesn't appear with code completion even after the site is built. The code is executed at the start so I have placed it in the Global.asax code behind.

{% highlight aspx-vb linenos %}

Imports System.Web.Http
Imports System.Web.Routing

Public Class AppStart
  Inherits HttpApplication

  Protected Sub Application_Start(sender As Object, e As EventArgs)

    RouteTable.Routes.MapHttpRoute("webApi", "api/{controller}/{action}", _
      New With {.action = RouteParameter.Optional})
      
  End Sub

End Class

{% endhighlight %}

Now we have a router in place we can start adding some controls. For this example I've just added a simple web user control that mimics a login control.

{% highlight aspx-vb linenos %}

<%@ Control %>

<form method="post" action="api/login">
  <input placeholder="Username" name="name" required />
  <input type="password" placeholder="Password" name="password" required />
  <input type="submit" value="Login" />
</form>

{% endhighlight %}

The control is placed in master page in this example.

{% highlight aspx-vb linenos %}

<%@ Master %>
<%@ Register Src="Login.ascx" TagName="Login" TagPrefix="uc1" %>

<!DOCTYPE html>
<html>
  <head>
    <title>ASP.NET Website with Web Api</title>
  </head>
  <body>
    <uc1:Login runat="server" />
    <form runat="server">
      <asp:ContentPlaceHolder ID="content" runat="server" />
    </form>
  </body>
</html>

{% endhighlight %}
          
Finally to wrap it all up a controller is added to manage the http requests. For this example I created the POCO "User" object which is sent via a post request. Because Web API automatically maps the request type to the controller you can simply call the method "Post".

{% highlight vbnet linenos %}

Imports System.Web.Http

Public Class LoginController
  Inherits ApiController
  
  Public Sub Post(<FromBody()> user As User)

    Dim name = "login-error"
  
    If user.Name = "matt" And user.Password = "password" Then
      name = "welcome"
    End
    
    HttpContext.Current.Response.Redirect(String.Format("/{0}.html", name))

  End Sub

End Class

{% endhighlight %}

So now when we navigate to an aspx page and enter the details in the login form we have Web API working alongside Web Forms.

{ % asset posts/20141126/login-form.jpg % }
        
And we can debug just as we would if we were using a VS Web Project rather than a more simple website.

{ % asset posts/20141126/debugging.jpg % }

This is a really basic example and is missing a few things (session state for example) and I usually code in C# but copied this code from a website I currently support. It is possible to have both C# and VB.NET running side by side (another reason I didn't want to convert the website to a project) but that's a post for another day.

Please add comments below and let me know if you found this useuful.

All the code for this post can be found on github [here](https://github.com/matthewblott/WebsiteWithApi).
