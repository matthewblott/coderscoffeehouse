---
layout: post.html
title:  Simple ASP.NET Auth (Update)
date:   2018-07-30
tags: tech
---


This is a sentence with ```this block written in code font``` appearing all of a sudden.

A few months ago I put together a simple [starter project]( 2017-09-05-simple-aspnet-auth ) for ASP.NET authorisation without any dependencies or configuration setup requirements. The motivation was my frustration with the complexity of the tutorials for something that should really be quite simple. I did leave the token based authorisation only partially complete however - there was no refresh token included which was an oversight on my part. Anyhow, I've gone ahead and done this plus a few other changes.

## Token Based Authorisation

As mentioned this will now generate a refresh token upon login. The concept is simple - when your token times out you send it along with the refresh token and receive another so you can continue with your session. I'm not going to go down into too much detail - the whole point of the project was to provide a code sample so simple it's easy to follow. There's a service ```TokenService``` which has three public methods ```GenerateAccessToken```, ```GenerateRefreshToken```, and ```GetPrincipalFromExpiredToken```. The first two are fairly obvious, the last is required so we can locate our refresh token in the database. That's a minor change from the previous project - there's now a database (of sorts!). Don't worry though, it's just a text file but it's to simulate what you would do in a real world scenario - the refresh token would be saved against the logged in user.

There's a new ```TokenController``` which has two actions ```Refresh``` and ```Revoke``` which again should be fairly obvious.

### Putting it together

It works much the same as before. To login as the ```admin``` user run the following in your terminal.

```shell

curl -X POST http://localhost:5000/api/login -H "Content-Type: application/x-www-form-urlencoded" -d "Name=admin&Password=password"

```

This will return something similar to the following.

```shell
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJhZG1pbnMiLCJuYmYiOjE1MzI5ODI5OTYsImV4cCI6MTUzMjk4MzA1NiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwL2FwaS8iLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAvYXBpLyJ9.PwL9AKuVh0yIheBG-bXMdK5X8Q1USzvE2gebYyBgVT0","refreshToken":"xmUsVDGtPpaMDqkkZqAwEv2T7n07zFwL31aYddf0WSY="

```

Save both the ```token``` and the ```refreshToken``` as variables your terminal as follows as we'll need these in a bit.

```shell

TOKEN_VALUE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHR ...

REFRESH_TOKEN=xmUsVDGtPpaMDqkkZqAwEv2T7n07zFwL31aYddf0WSY=

```

The ```refreshToken``` will be saved against the user - if you open the ```users.json``` file you should see something like the following.

```shell

{
  "Id": 1,
  "Name": "admin",
  "Password": "password",
  "RefreshToken": "xmUsVDGtPpaMDqkkZqAwEv2T7n07zFwL31aYddf0WSY=",
  "Groups": [
    {
      "Id": 1,
      "Name": "admins"
    },
    {
      "Id": 2,
      "Name": "superusers"
    },
    {
      "Id": 3,
      "Name": "users"
    }
  ]
}

```

You can then run your commands as before like the following.

```shell

curl http://localhost:5000/api/admin -H "Authorization: Bearer $TOKEN_VALUE"

```

Which returns the following expected text.

```shell

Only authenticated token based requests from admins receive this message

```

When this no longer works we just request a new token with the following.

```shell

curl -X POST http://localhost:5000/api/token/refresh -H "Content-Type: application/x-www-form-urlencoded" -d "token=$TOKEN_VALUE&refreshToken=$REFRESH_TOKEN"

```

This will return json similar to that returned with the login step containing both the ```token``` and ```refreshToken```.

To revoke the token at any time (if for example, when you wish to logout) run the following.

```shell

curl -X POST http://localhost:5000/api/token/revoke -H "Authorization: Bearer $TOKEN_VALUE" -H "Content-Length: 0"

```

There's now a signup method which allows you to create a new user. Once you've done this you can login as show earlier.

```shell

curl -X POST http://localhost:5000/api/signup -H "Content-Type: application/x-www-form-urlencoded" -d "Name=test1&Password=password"

```

### Other changes

I've created some example projects to keep the code size down for the different scenarios (since that was the whole point of the exercise). Below is the ```tree``` of the folder where they reside which is in the root of the repository.

```shell

.
└── examples
    ├── api
    ├── cookies
    ├── cookies+api
    └── cookies+api+policies

```

To run all the tests as shown on the home page you probably should use the ```cookies+api``` project. I've removed ASP.NET policies from the projects as these aren't actually necessary. You can use roles which does the same and the code base is now very small. I've kept the ```cookies+api+policies``` project for legacy purposes. The ```api``` and ```cookies``` projects are for when you only require one of those authentication types.

I should probably do some proper documentation as the home page is now slightly out of date and the repo is starting to expand a bit but I'll see what the feedback is like.

Here's the [link](https://github.com/matthewblott/simple_aspnet_auth) to the code on Github.

Enjoy :-)