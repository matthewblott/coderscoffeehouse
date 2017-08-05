---
layout: post
title:  Markdown
date:   2017-07-20 00:00:00
categories: tech
---

1. 

No longer possible ....

@Html.Action("ListByUser", "Centre", new ListBoxViewModel

Can only do which doesn't allow you to call the controller and perform any action on the model

@Html.Partial("PartialName", viewModel)

Read more about partials here ...
https://docs.microsoft.com/en-us/aspnet/core/mvc/views/partial

View Components to the rescue ...


2.

Stuff like this stopped working when using the 2.0.0 ASP.NET libraries ...

@for (var page = Model.StartPage; page <= Model.EndPage; page++)
{
  <li class="page-item @(page == Model.PageNumber ? "active" : string.Empty)">
    <a class="page-link" href="~/@Model.LinkPrefix/pages/@page/@Model.PageCount">@page</a>
  </li>
}


Note the brackets surrounding 'page', required to get it working.

<a class="page-link" href="~/@Model.LinkPrefix/pages/@(page)/@Model.PageCount">@(page)</a>

3.

It gets worse. Using code in simple markup.

foreach(var price in item.Product.Prices)
{
  <option @(price.Quantity == item.Quantity ? "selected" : string.Empty)>@(price.Quantity)</option>
}

Gave me the following error ...

The tag helper 'option' must not have C# in the element's attribute declaration area.

What does this even mean? I'm not using a tag helper. I thought maybe it referred to markup inside an element that's using a tag helper but the view was just code I'd copied and pasted from the existing MVC5 application. I found a workaround from this Github thread here ...

https://github.com/aspnet/Mvc/issues/3733

... which is to prefix the line with ```@:``` like so ...

@: <option @(price.Quantity == item.Quantity ? "selected" : string.Empty)>@(price.Quantity)</option>

4.

Updating Cookies (wrong).

This doesn't work ...

Response.Cookies.Append(cookieValue, cookieName)

Turns out this was to do with the size of the cookie!

5. 

Data Protection

https://www.codeproject.com/Articles/1152468/Data-Security-in-ASP-NET-Core