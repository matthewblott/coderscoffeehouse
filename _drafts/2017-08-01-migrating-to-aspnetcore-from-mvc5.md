---
layout: post
title:  Migrating to ASP.NET Core from MVC5
date:   2017-08-01 00:00:00
categories: tech
---

I recently shipped my first production app using ASP.NET .NET Core. It's a back office system that was a port of an existing MVC5 app running on Mono / Linux. This post isn't so much a technical breakdown of how to migrate to .NET Core but is documentation of the issues you might come across - particularly when working outside of Windows - with (hopefully) some helpful pointers.

Jump straight to 2.0
--------------------

When I started my migration project 1.1 was the current Core version and a lot of older .NET 2.0 stuff wouldn't run. There were a couple of older modules using things like ```WebClient``` and ```System.Data``` that I was resigned to having to rewrite. Of course people will no doubt say these things should be rewritten but that's the thing with old code that works, it tends not to get rewritten if it does the job satisfactorily (see how much we still rely on COBOL [here](https://www.ibm.com/blogs/ibm-training/did-you-know-80-percent-of-the-worlds-daily-business-transactions-rely-on-cobol/)).

Anyhow ASP.NET is now out and .NET Core 2.0 is in preview and the release is imminent. If you're planning a migration you'll encounter far less problems jumping straight to 2.0. I did and a lot of incompatibility issues went away, the .NET team need congratulating on their efforts here in making the surface area of Core as wide as possible.

Make sure the libraries you use are 2.0 also.


Points of Interest
------------------

### csproj

Note compile razor attribute

{% highlight csharp linenos %}

<!-- web project -->

<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>netcoreapp2.0</TargetFramework>
    <MvcRazorCompileOnPublish>true</MvcRazorCompileOnPublish>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.Extensions.Logging.Debug" Version="2.0.0-preview2-final" />
    <PackageReference Include="AutoMapper" Version="6.1.1" />
    <PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="2.0.1" />
    <PackageReference Include="Newtonsoft.Json" Version="10.0.3" />
    <PackageReference Include="Hangfire" Version="1.6.14" />
    <PackageReference Include="Microsoft.AspNetCore.All" Version="2.0.0-preview2-final" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\services-library\services-library.csproj" />
    <ProjectReference Include="..\other-library\other-library.csproj" />
  </ItemGroup>
</Project>

<!-- refernced libary -->

<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Dapper" Version="1.50.2" />
    <PackageReference Include="Microsoft.CSharp" Version="4.3.0" />
    <PackageReference Include="NLog.Extensions.Logging" Version="1.0.0-rtm-beta5" />
    <PackageReference Include="Microsoft.Extensions.Configuration" Version="1.1.2" />
    <PackageReference Include="Microsoft.Extensions.Configuration.Json" Version="1.1.2" />
    <PackageReference Include="Humanizer.Core" Version="2.2.0" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="..\data-library\data-library.csproj" />
  </ItemGroup>
</Project>

{% endhighlight %}


### Tag Helpers

Why they're good and why I didn't use the old Razor controls.

asp-controller

### DI



This is so easy.

##### Mapping


Add AutoMapper.Extensions.Microsoft.DependencyInjection

{% highlight csharp linenos %}


	public class MappingProfile : Profile
	{
		public MappingProfile()
		{
			CreateMap<Address, AddressViewModel>().ReverseMap();
      CreateMap<Pager, PagerViewModel>().
        ForMember(dst => dst.DbOffset, opt => opt.MapFrom(src => src.Offset)).
        ForMember(dst => dst.PageSize, opt => opt.MapFrom(src => src.Size)).
        ForAllOtherMembers(opt => opt.Ignore());

      ...

		}

{% endhighlight %}

Then in the ConfigureServices method

{% highlight csharp linenos %}

			services.AddAutoMapper();


{% endhighlight %}




Gotchas
-------

There are a few things that you'll find work differently which will catch you out.

### View Components

For exmaple this line of MVC5 code doesn't work.

{% highlight csharp linenos %}

@Html.Action("ActionName", "ControllerName", new ParamaterObjectName())

{% endhighlight %}

You can no longer call a controller from the ```Action``` method. You can still call partials like so.

{% highlight csharp linenos %}

@Html.Partial("PartialName", viewModel)

{% endhighlight %}

But to achieve something more powerful as with the ```Action``` method you'll want to use View Components (more on them [here](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/partial)). These are new to ASP.NET and at first I wasn't too sure about them but the big plus side is they allow you to inject components into your views using HTML friendly markup like so.

{% highlight csharp linenos %}

<vc:user-paired-list-box
  name="AddressId"
  target-id="user-addresses"
  user-id="@Model.Id"
  value="@Model.AddressId"
  user-paired-list-box-type="1"
  />
</div>

{% endhighlight %}

The above example calls the View Component and passes in the attributes as arguments. Some actions are then performed server side and a view model passed to the components view which renders the following to the user.

![]({% asset_path posts/20170812/185959-xs.jpg %})

The details are outside the scope of this post but I mention it here as something you might come across if you're using ```Action``` as I was.

One final thing on View Components, make sure you add the namespace to the ```_ViewImports.cshtml``` file as shown in the third line below as this is another thing that caught me out!

{% highlight csharp linenos %}

@using your_namespace
@addTagHelper *, Microsoft.AspNetCore.Mvc.TagHelpers
@addTagHelper *, your_namespace

{% endhighlight %}


Stuff like this stopped working when using the 2.0.0 ASP.NET libraries.

{% highlight csharp linenos %}

@for (var page = Model.StartPage; page <= Model.EndPage; page++)
{
  <li class="page-item @(page == Model.PageNumber ? "active" : string.Empty)">
    <a class="page-link" href="~/@Model.LinkPrefix/pages/@page/@Model.PageCount">@page</a>
  </li>
}

{% endhighlight %}

### Markup Errors

If you're used to using Visual Studio it has quite good built in support for flagging errors in your Razor views. But I don't use Visual Studio (at least not the Windows version) and got caught out with some subtle errors in the views.

For example the following is a snippet based on a pager control I use which has a page number as a variable. This view crashed when the page was accessed.

{% highlight csharp linenos %}

@{
  var pageNumber = 1;
}

<a class="page-link" href="~/users/pages/@page">@page</a>

{% endhighlight %}

The fix required the variable be contained in brackets like so.

{% highlight csharp linenos %}

@{
  var pageNumber = 1;
}

<a class="page-link" href="~/users/pages/@(page)">@(page)</a>

{% endhighlight %}

FWIW this actually worked with ASP.NET Core 1.1 without the brackets but with 2.0 you'll need to use them to get it to work.

Another one that is less obvious was the HTML ```option``` tag gets treated like an ASP.NET tag helper. So this snippet of code which contains no obvious errors doesn't work.

{% highlight csharp linenos %}

foreach(var price in item.Quantity)
{
  <option @(item.Quantity == selectedValue ? "selected" : string.Empty)>@(item.Quantity)</option>
}

{% endhighlight %}

I was presented with the following error.

{% highlight bash linenos %}

The tag helper 'option' must not have C# in the element's attribute declaration area.

{% endhighlight %}

What does this even mean? I'm not using a tag helper. I thought maybe it referred to markup inside an element that's using a tag helper but the view was just code I'd copied and pasted from the existing MVC5 application. I found a workaround from this Github thread [here](https://github.com/aspnet/Mvc/issues/3733) which is to prefix the line with ```@:``` like so.

{% highlight csharp linenos %}

@: <option @(price.Quantity == item.Quantity ? "selected" : string.Empty)>@(price.Quantity)</option>

{% endhighlight %}

### Data Protection

https://www.codeproject.com/Articles/1152468/Data-Security-in-ASP-NET-Core


### Membership

I was most worried about this.

{% highlight csharp linenos %}

var userGroups = this.groupService.GetByUser(user.Id);

foreach(var userGroup in userGroups)
{
  claims.Add(new Claim(userGroup.Name, userGroup.Id.ToString()));
}

var props = new AuthenticationProperties
{
  IsPersistent = true,
  ExpiresUtc = DateTime.UtcNow.AddMinutes(20),
};

var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
var principal = new ClaimsPrincipal(identity);

await this.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, props);

{% endhighlight %}

Add the following to ConfigureServices

{% highlight csharp linenos %}

services.AddAuthorization(options =>
{
  options.AddPolicy("Admin",
    policy =>
    {
      policy.Requirements.Add(new AdminRequirement());
    });

  options.AddPolicy("SuperUser",
    policy =>
    {
      policy.Requirements.Add(new AdminRequirement(true));
    });

});

{% endhighlight %}

Decorate your controllers and actions with

{% highlight csharp linenos %}

[Authorize("SuperUser")]

{% endhighlight %}

I wanted to make a way that would prevent access unless it was explicitly declared so you need to decorate any parts of the system that you want to gain access with the AllowAnonymous attribute (at the very least the login page).


Release
-------

# Install dotnet instructions
https://www.microsoft.com/net/core#linuxubuntu

# deploy instructions
https://docs.microsoft.com/en-us/aspnet/core/publishing/linuxproduction

# in solution folder
dotnet build -c release

# the following creates the publish directory under release/netcoreapp2.0/
# the publish folder contains the compiled view binary and is what we ship
dotnet publish -c release


