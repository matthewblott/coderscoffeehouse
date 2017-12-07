---
layout: post
title:  Nginx Cheat Sheet
date:   2017-12-01 00:00:00
categories: tech
---

SSL
---

The aspnet docs say nginx should be compiled with the ssl module because it's not included with the default install but this appears to be incorrect. If you run ```nginx -V``` and can see ```--with-http_ssl_module``` then it's installed.

View the certificates and check it matches

{% highlight shell linenos %}

openssl x509 -in $name.crt -text

{% endhighlight %}

To get rid of the red cross through https (Always Trust). See [https://peteskelly.com/testing-ssl-in-asp-net-core-mac/amp/](https://peteskelly.com/testing-ssl-in-asp-net-core-mac/amp/).

Create ```/etc/nginx/proxy.conf```.

{% highlight shell linenos %}

proxy_redirect       off;
proxy_set_header     Host       $host;
proxy_set_header    X-Real-IP     $remote_addr;
proxy_set_header    X-Forwarded-For  $proxy_add_x_forwarded_for;
proxy_set_header    X-Forwarded-Proto $scheme;
client_max_body_size   10m;
client_body_buffer_size 128k;
proxy_connect_timeout   90;
proxy_send_timeout     90;
proxy_read_timeout     90;
proxy_buffers      32 4k;

{% endhighlight %}

Add the following line below ```http``` to ```/etc/nginx/nginx.conf```.

{% highlight shell linenos %}

include    /etc/nginx/proxy.conf;

{% endhighlight %}

Redirect www to non wwww
------------------------

{% highlight shell linenos %}

server {
        server_name www.example.com;
        return 301 $scheme://example.com$request_uri;
}

{% endhighlight %}

Then your server block ....

{% highlight shell linenos %}

server {
        listen 80;
        server_name matthewblott.com;

....

{% endhighlight %}


Block IP
--------

I started reading through this article [here](https://www.cyberciti.biz/faq/linux-unix-nginx-access-control-howto/) which pointed to some files I don't have and explains how to do things at the server (not site) level.

I found this answer [here](https://stackoverflow.com/questions/46239870/how-to-use-ngx-http-access-module).

{% highlight shell linenos %}

server {
        server_name sitename;
        root /var/www/sitename;
        index index.html;

        allow 000.000.000.000;
        deny  all;

}

{% endhighlight %}

Substitute ```000.000.000.000``` for the ip address you wish to allow and ```sitename``` for the domain of your site.

Make sure you put the ip address you wish to allow before ```deny all``` afterwards.

Test everything works.

{% highlight shell linenos %}

sudo nginx -t

{% endhighlight %}

Restart the service.

{% highlight shell linenos %}

sudo service nginx restart

{% endhighlight %}

Locations
---------

{% highlight shell linenos %}

server {
        server_name sitename;
        root /var/www/sitename;
        index index.html;

        location = /allow-all {
                allow all;
        }

        location = / {
                allow 000.000.000.000;
                deny  all;
        }

}

{% endhighlight %}
