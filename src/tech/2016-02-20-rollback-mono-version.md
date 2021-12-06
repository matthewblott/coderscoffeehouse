---
layout: post.html
title:  "Mono Linux Rollback"
date:   2016-02-20 00:00:00
tags: tech
---

A quick post this one but like my others it's a useful personal documentation exercise for an issue I've had to deal with. Mono runs pretty smoothly on Linux but having used it for a while it's apparent to me that .NET is a second class citizen on Linux. And as such I came across a [truly horrible and shocking bug](http://mono.1490590.n4.nabble.com/Anyone-having-SqlDataAdapter-problems-with-4-2-1-td4667001.html)
quite recently on version 4.2.1. (Essentially the bug causes a crash every time the Fill method of the SqlDataAdapater is called - one of the most routine and basic operations a .NET developer is likely to perform. This would never have happened on the Windows version and underlines how Xamarin are more concerned with enterprise mobile than .NET on Linux but that's a post for another day.)

First Mono needs to be completely removed from the system which is done by running the following commands.
 
```shell

sudo apt-get remove mono-complete
sudo apt-get purge mono-complete
sudo apt-get autoremove

```

Then update the source list with the version you wish to install by running the following command (replace ```x.x.x``` of the code snippet below with the version number you wish to install - in my case it was 4.0.5).

```shell

echo "deb http://download.mono-project.com/repo/debian wheezy/snapshots/x.x.x main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list

```

Finally run update and install the mono packages as shown below.

```shell

sudo apt-get update
sudo apt-get install mono-devel
sudo apt-get install mono-complete

```

And that's it. Pretty simple :-)