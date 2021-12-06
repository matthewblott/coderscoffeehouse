---
layout: post.html
title:  Simple ASP.NET Auth
date:   2017-09-05 00:00:00
tags: tech
---

.NET Core has been with us for a while now and I was someone who did a fair bit of work with it early on. I was keen to use it as MVC on Mono came with its own set of problems but I only shipped my first app to production on .NET Core fairly recently. One of the things holding me back from migrating from MVC5 was user management. I've only used the Membership model in the form of a roles based custom provider with a few overridden methods. My interfaces were something like the following.

```csharp

public interface IMembershipProvider
{
  bool ValidateUser(string name, string password);
}

public interface IRoleProvider
{
  string[] GetRolesForUser(string username);
  bool IsUserInRole(string username, string rolename);
}

```

And I had this working with SimpleInjector for DI with the code below.

```csharp

container.Register<IMembershipProvider>(() => new MembershipProvider(new UnitOfWork(connStr)), Lifestyle.Scoped);
container.Register<IRoleProvider>(() => new RoleProvider(), Lifestyle.Scoped);

```

I've seen various articles over the past few years about 'Identity' and why the old way of doing things is bad. Usually the articles cite security concerns but very few of us are writing high traffic public websites. Most development (mine included) is boring Line-of-business (LOB) CRUD apps, sometimes running on an intranet and often with a hyper vigilant network team monitoring the traffic on the production machine. I could see no compelling reason to change my user management model which though not perfect was simple to setup and secure enough for my needs. But ASP.NET Core is a complete rewrite, Membership would not be ported and the idea of having to implement Identity was an impediment to me porting existing apps to Core.

A few weeks ago I decided to bite the bullet and come up with a solution for moving my existing user management model across to ASP.NET Core. Heading over to the official documents seemed a good place to start but you soon become overwhelemed with the myriad of options - roles based authorisation which requires an application roles manager, a user roles manager and group role manager, claims based authorisation along with claims, claims principal and claims identity, policy based authorisation, JWT and token based authorisation, OAuth, OAuth2, Identity Server, Identity Server 4. Plus every example I came across came with the usual MS tech stack straightjacket. Don't want to use EF? How do you decouple from that? Don't want SQL Server? Where's the example of just using Sqlite? Try doing something in Rails or Django and it's a breeze by comparison (see [here](https://sourcey.com/building-the-prefect-rails-5-api-only-app/) by way of example).

KISS
----

In the end I found out you can decouple the things you don't want (EF, SQL Server, Identity Server in my case) and knock out a really simple solution for which I've created a boilerplate [here](https://github.com/matthewblott/simple_aspnet_auth). The requirements for this solution were.

* No EF dependency (or dependency on any other ORM).
* No database dependency.
* Only use the main ASP.NET Core meta package.
* No password hashing or encryption dependency (nothing is done here, you can implement whatever you want).
* An easy to follow implementation for rules (I've tied user groups to claims and built a couple of easy to follow policies, obviously others can be added as required).
* A token based API.

Using the 80 / 20 rule I've gone for a user with user group model. I've kept the POCOs simple.

```csharp

public class User
{
  public int Id { get; set; }
  public string Name { get; set; }
  public string Email { get; set; }
  public string Password { get; set; }
  public IList<Group> Groups { get; set; }
}

public class Group
{
  public int Id { get; set; }
  public string Name { get; set; }
}

```


In my somewhat contrived example I have a simple IUserService with a single method to retrieve the user (and check the password).

```csharp

public interface IUserService
{
  User GetByName(string name);
}

```

This is injected in the required controller using ASP.NET Core's built in DI.

```csharp

services.AddScoped<IUserService, UserService>();

```

The ```UserService``` class itself creates a ```List``` of type ```User``` in the constructor, obviously in a real world situation you'd be calling some sort of database provider but I wanted to strip out those sort of dependencies to keep it simple.

The ```Startup``` class is where all the plumbing is done. I've deliberately left things out as I wanted the example to show the code related to the problem domain. The main points of interest in ```Startup``` are:

* The different authentication schemes are added for both cookie and JWT based authentication. I have to thank Shawn Wildermuth for this after reading how to do that on his site [here](https://wildermuth.com/2017/08/19/Two-AuthorizationSchemes-in-ASP-NET-Core-2).
* A couple of policies are added (as referred to earlier) which should be simple to follow. One check's the logged in user is a member of the superusers group and the other that they are a member of admins.

Other than that, there's not much else going on, just some simple setup stuff.

The ```LoginController``` class is where the authentication process happens with the methods for both cookie and JWT logins - Login and ApiLogin respectively.

The ```ExampleController``` is where the examples of different logins can be tested out using ASP.NET's ```Authorize``` attribute. For example the following method will only return the string if the user logged in with JWT and is a member of the superusers group.

```csharp

[HttpGet]
[Route("~/api/superuser")]
[Authorize(Policy = GroupNames.SuperUsers, AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
public string ApiSuperUser()
{
  return "Only authenticated token based requests from superusers receive this message.";
}

```

The Github home page has a full list of the methods in ```ExampleController``` with explanations for each. It's very easy to get up and running, there's no migration step or setting up - you can just download the project and type ```dotnet restore``` followed by ```dotnet run``` in the console and you're away.


Caveats
-------

As mentioned this is a boilerplate solution so there's lots of things missing (there's no error handling for example which you'd want to implement). I wanted to keep the code size down so you don't have to wade through ASP.NET Core 'isms' in the code, just the stuff that's relevant!

There's no logout implemented for JWT. I couldn't find a satisfactory way to do this using JWT itself and after doing a bit of research it wasn't clear to me that it is possible. The SPA examples I've seen save the JWT token to ```localStorage``` and then delete it when the user 'logs out'. This makes sense as token based authorisation is supposed to be stateless. However there is still the issue of what happens when your token expires and for this you should use a refresh token. I've not imlemented that here but there's a tutorial provided below.

Further Links
-------------

Implementing an API with access token and refresh token [here](http://www.c-sharpcorner.com/article/handle-refresh-token-using-asp-net-core-2-0-and-json-web-token).

As mentioned above, there's no encryption included. For a simple encryption soluton see [here](http://mikaelkoskinen.net/post/encrypt-decrypt-string-asp-net-core).

For more on hashing, encryption and randomisation in ASP.NET Core see [here](https://www.devtrends.co.uk/blog/hashing-encryption-and-random-in-asp.net-core).

And for an excellent tutorial on authorisation and authentication (and the differences between the two) in ASP.NET Core see [here](https://andrewlock.net/introduction-to-authentication-with-asp-net-core).
