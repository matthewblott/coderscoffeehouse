---
layout: post
title:  Exploring The DotNet Command
date:   2017-08-27 00:00:00
categories: tech
---

I've been using the new ```dotnet``` command in my workflow for a little while (anyone that's made the switch to .NET Core will soon realise you can't stay away from it, probably even if you're using Visual Studio). It's quite powerful but I haven't really explored it beyond the basics so thought I'd have a bash at using it for more than just doing simple build stuff.

When I'm not sure of terminal switches to get familiar I type out the full switch names so I can see what I've done when I scan my terminal (the point being here that a lot of the following examples can be shorted with one character switches).


Console App
-----------

So I knocked together a basic console app with a seperate class library.

First I created my root directory.

{% highlight shell linenos %}

mkdir vscode_fun
cd vscode_fun

{% endhighlight %}

Then created the console app.

{% highlight shell linenos %}

dotnet new console --name myconsole --output myconsole

{% endhighlight %}

The ```output``` switch created the directory named (I expected this would happen but didn't know until I'd tried!) with the ```.csproj``` project file inside and a simple ```Program.cs``` file for simple 'Hello World' style program.

Sure enough if you ```cd``` to the directory and run ```dotnet run``` you'll see ```"Hello World!" ``` printed to the console but to run it from the current location you'll need include the ```project``` switch.

{% highlight shell linenos %}

dotnet run --project myconsole

{% endhighlight %}

The ```project``` switch is for a ```.csproj``` file but it's intelligent enough to search any provided path and locate the file itself.


Class Library
-------------

So for the second part, creating a class library.

{% highlight shell linenos %}

dotnet new classlib --name mylib --output mylib

{% endhighlight %}

The above command is much the same as before apart from the project type is different, ```classlib``` is specified instead of ```console```. This creates a ```.csproj``` and a simple class file named ```Class1.cs```. I changed this to a basic ```Greeter``` class with the following code.

{% highlight csharp linenos %}

namespace mylib
{
  public class Greeter
  {
    public string GetGreeting(string name)
    {
      return $"Hello {name}";
    }

  }
  
}

{% endhighlight %}


Project Reference
-----------------

Pretty simple so far but how do you add a project reference to the console app so it can call the library? That's done with the following command.

{% highlight shell linenos %}

dotnet add myconsole reference mylib/mylib.csproj

{% endhighlight %}

The ```myconsole``` after ```add``` above is an optional path to the project file you wish to change and can be just a path to the directory the file resides. If none is supplied the current directory is used. In our example here we have to specify the path as we're in the directory above. The argument after ```reference``` must be a full path to the project you wish to include and must include the ```.csproj``` file name.

If we check the console app project file with ```cat myconsole/myconsole.csproj``` we can see it's added a reference.

{% highlight csharp linenos %}

<ItemGroup>
  <ProjectReference Include="..\mylib\mylib.csproj" />
</ItemGroup>

{% endhighlight %}

To remove a project refernece just substitute the ```add``` option to ```remove```.

{% highlight shell linenos %}

dotnet remove myconsole reference mylib/mylib.csproj

{% endhighlight %}

### Putting it together

Now the console app's ```Program.cs``` file can be changed to reference the new added library.

{% highlight csharp linenos %}

using System;
using mylib;

namespace myconsole
{
  class Program
  {
    static void Main(string[] args)
    {
      var greeter = new Greeter();
      var name = "dotnet demo";
      var greeting = greeter.GetGreeting(name);

      Console.WriteLine(greeting);

    }

  }

}

{% endhighlight %}

Again simple stuff. We can just run the simple ```dotnet run``` command which does a build for us and then executes the program so we have ```Hello dotnet demo``` printed to the console as expected.

Nuget Packages
--------------

Adding Nuget packages is an essential part of a .NET program and that can also be easily achieved using the ```dotnet``` command like so.

{% highlight shell linenos %}

dotnet add mylib package newtonsoft.json

{% endhighlight %}

Have a look in the ```.csproj``` file and you'll see the package reference is added.

{% highlight csharp linenos %}

<ItemGroup>
  <PackageReference Include="newtonsoft.json" Version="10.0.3" />
</ItemGroup>

{% endhighlight %}

As with removing project references to remove Nuget packages just change ```add``` to ```remove```.

{% highlight shell linenos %}

dotnet remove mylib package newtonsoft.json

{% endhighlight %}

### Putting it together

To test I just modified my ```Class1.cs``` file with the following contrived example.

{% highlight csharp linenos %}

using System;
using Newtonsoft.Json;

namespace mylib
{
  public class Person
  {
    public int Id {get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
  }

  public class Greeter
  {
    public string GetGreeting(string name)
    {
      return $"Hello {name}";
    }

    public void TestJsonExample()
    {
      var person = new Person
      {
        Id = 1,
        FirstName = "John",
        LastName = "Wayne"
      };

      var json = JsonConvert.SerializeObject(person, Formatting.Indented);

      Console.WriteLine(json);

    }

  }
  
}

{% endhighlight %}

And then added the line ```greeter.TestJsonExample();``` to the ```Program.cs``` file of the console app. Then I could run the following again.

{% highlight shell linenos %}

dotnet run --project myconsole

{% endhighlight %}

Now as well as my ```Hello dotnet demo``` message I get the following printed to the console.

{% highlight shell linenos %}

{
  "Id": 1,
  "FirstName": "John",
  "LastName": "Wayne"
}

{% endhighlight %}

There are a few other commands that I thought I might need to run like ```restore``` and ```build``` but the ```run``` command does a good job of detecting changes and restoring packages and project references to simplify your workflow.


Testing
-------

A core part of any project is testing. The ```test``` command allows us to do this but I noticed when I selected ```dotnet new --help``` to see the available templates there are only ones available for xUnit and MSTest. I use NUnit because it allows me to order tests which I sometimes need to do with integration testing so I wondered if that was possible and I found that it is.

### Install Template

There is a list of available templates [here](https://github.com/dotnet/templating/wiki/Available-templates-for-dotnet-new) and fortunately I found there is one for NUnit which I installed as below.

{% highlight shell linenos %}

dotnet new -i "NUnit3.DotNetNew.Template::*"

{% endhighlight %}

I then created the test project.

{% highlight shell linenos %}

dotnet new nunit --name mylib.tests --output mylib.tests

{% endhighlight %}

This creates a basic NUnit 3 test project which includes the following test file.

{% highlight csharp linenos %}

using NUnit.Framework;

namespace Tests
{
  public class Tests
  {
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public void Test1()
    {
      Assert.Pass();
    }
  }
}

{% endhighlight %}

Again we'll create a somewhat contrived example for our tests. First add the project we want to test.

{% highlight shell linenos %}

dotnet add mylib.tests reference mylib/mylib.csproj

{% endhighlight %}

Then add a test.

{% highlight csharp linenos %}

[Test]
public void Should_return_expected_greeting()
{
  var greeter = new Greeter();

  var name = "Jack";

  var expectedGreeting = $"Hello {name}";

  var greeting = greeter.GetGreeting(name);

  Assert.AreEqual(expectedGreeting, greeting);

}

{% endhighlight %}

The test project can then be run with the following command.

{% highlight shell linenos %}

dotnet test mylib.tests

{% endhighlight %}

You should see something like the following in your terminal.

{% asset posts/20170827/204913-sm.jpg %}

If you execute ```dotnet``` from within the test project itself the last argument (the path of the ```.cpsproj``` file) isn't necessary.

Summary
-------

I was pleasantly surprised at how easy it was to get up and running, particuarly setting up a test project. Anyone who's done any front end work will know what a PITA setting up build and test projects with the associated tools is (at least that's always been my experience) but here everything worked as expected with little in way of configuration. Of course there's a lot more for creating builds but this was just a quick exploration and is something I expect I'll be using a lot more.