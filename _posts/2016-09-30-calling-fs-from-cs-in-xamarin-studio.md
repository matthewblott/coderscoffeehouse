---
layout: post
title:  Calling F# from C# in Xamarin Studio 
date:   2016-09-30 00:00:00
categories: tech
image_path: /assets/posts/20160930/
---

I've been using Xamarin Studio for some time and now use it daily for my work with Mono. I've also been dabbling a bit in F# and have been keen to start using it at work. Untypically for a Xamarin Studio user I don't use it for building mobile apps but have been writing various parts of a production system which I'm slowly moving off Windows. Anyhow, what better place to start than converting some of the C# libraries to F#?

### Setup


The setup should be very simple. A C# console application that calls an F# library. As you can see in this very simple example I've just created a standard C# console project that calls a standard F# library project. There are no special libraries required.

![]({% asset_path posts/20160930/153605-sm.jpg %})

Normally when working with Xamarin Studio adding a library project is much the same as you would do with Visual Studio. Be aware the referenced version of .NET might be different when creating a new project, the defaults for C# and F# are different on my system which I had to change (I needed to change it to Mono / .NET 4.5.).

![]({% asset_path posts/20160930/154422-xs.jpg %})

![]({% asset_path posts/20160930/154725-xs.jpg %})

So, once I have the correct framework referenced I just add the project as a reference.

![]({% asset_path posts/20160930/154858-xs.jpg %})

Great, now we're all good to go. Here's my crude F# library that I want to call.

{% highlight fsharp linenos %}

namespace fslib

type Greeter() = 
  member this.Greeting = "Hello World!"

{% endhighlight %}

And here's the C# code that calls the library in the console project.

{% highlight csharp linenos %}

using static System.Console;

class Program
{
  public static void Main()
  {
    var greeter = new fslib.Greeter();

    var greeting = greeter.Greeting;

    WriteLine(greeting);

  }
}

{% endhighlight %}

Fairly straightforward and if I hit the play button I get the output in the console I'm expecting.

![]({% asset_path posts/20160930/155617-sm.jpg %})

But although it works as expected the Xamarin Studio experience isn't so smooth. In my code editor the statement completion doesn't work and I have the unwanted red squigglies. If your project expands it looks like it's littered with errors.

![]({% asset_path posts/20160930/160020-xs.jpg %})

The way out of this is to reference the dll file and not the project itself. So untick the project in the Edit References dialog.

![]({% asset_path posts/20160930/160148-xs.jpg %})

And then browse to the dll file from the browse button on the .NET Assembly tab.

![]({% asset_path posts/20160930/160654-xs.jpg %})

Now if I build my project the red squigglies disappear and I have statement completion.

![]({% asset_path posts/20160930/160849-sm.jpg %})

However, when hit the play button I am no longer able to debug the F# code. I struggled with this for a while and should have guessed the Mono debug files are missing (a big thanks to Jason Imison from the Xamarin team for point this out to me [here](https://twitter.com/JasonImison/status/781864690733445120)!). So just copy over the mdb file from the F# library and place it in the Debug folder of the C# project ...

![]({% asset_path posts/20160930/161310-xs.jpg %})

... and the debugging will work as expected.

![]({% asset_path posts/20160930/161358-xs.jpg %})

You'll need to do this with each build if your code changes but this can be done by adding a simple ```cp``` command to your build step.

![]({% asset_path posts/20160930/162300-sm.jpg %})

That's it. Hopefully the Xamarin team will get this fixed but if you follow these simple steps you can work effectively without too much bother!