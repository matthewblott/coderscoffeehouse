---
layout: post.html
title:  "ASP.NET MVC with Xamarin Studio"
date:   2016-03-01 00:00:00
tags: tech
---

Anyone following along with my recent posts will notice I've been writing about working with Mono on Linux. I've covered [installing Mono on Linux](/tech/2015/12/09/mono-linux-setup.html) and [hosting a website](/tech/2016/01/19/aspnet-linux-setup.html) which for me was the hard part but some people have complained about the lack of anything for getting started outside Windows. As I've said before documentation for .NET outside Windows is a wasteland (which is part of my motivation for this blog) so here's a quick how to for getting started with MVC 5 on OSX with Xamarin Studio.

This tutorial isn't going to go through installing Xamarin Studio - there are installers on the Xamarin website for Windows and OSX that are stable and well supported. I don't think there's anything for Linux but Monodevelop is essentially the same product and there are instructions on the Monodevelop site for getting set up.

Once you have Xamarin Studio / Monodevelop installed, fire it up. Then select File -> New -> Solution from the top menu bar to see the selection of available templates. Select the ASP.NET MVC Razor Project template and click Next.

![](/assets/img/posts/20160301/2016-03-01@20.16.31-sm.jpg)

Give the project name and change the project directory if you wish.

![](/assets/img/posts/20160301/2016-03-01@21.15.51-sm.jpg)

Once the template is loaded you'll need to update the packages. Select the Packages folder on the explorer on the right-hand side.

![](/assets/img/posts/20160301/2016-03-01@20.19.01-sm.jpg)

Then right-click and select Update.

![](/assets/img/posts/20160301/2016-03-01@21.25.00-xs.jpg)
                       
We're almost there. First build the site with Command + B, then click the start button to start your website, a browser window will automatically pop up using your default web browser.

![](/assets/img/posts/20160301/2016-03-01@20.19.53-sm.jpg)

Unfortunately some of the references are out of date. This is one of those gotchas you have to look out for as I find packages aren't updated with the frequency they are using Visual Studio. Anyhow, this one's easily resolved. Open the Web.Config file in the Views folder and replace all references to 5.2.0.0 with 5.2.3.0 then save the file.

![](/assets/img/posts/20160301/2016-03-01@20.21.20-sm.jpg)

Rebuild the site again with Command + B then click the start button again and our website is working.

![](/assets/img/posts/20160301/2016-03-01@20.21.42-sm.jpg)

This is a pretty stratighforward tutorial but there were a couple of people requesting it so I hope it comes in handy. Feel free to leave any comments :-)