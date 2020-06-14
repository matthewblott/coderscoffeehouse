---
layout: post
title:  ASP.NET Mono Setup (or Mono Linux Setup Part 2)
date:   2016-01-19 20:23:00
categories: tech
---

This is the second entry of my posts on working with .NET (Mono) on Linux. The [first](/tech/2015/12/09/mono-linux-setup.html) installment showed how to install Mono on Linux and execute a very basic C# program. Next I'll go through the steps for setting up ASP.NET itself and running a website. As mentioned in my previous post there's a dearth of articles and help for us .NET programmers coming over to the world of Linux so I want to do a bit more than just show a few steps but actually document what I've done to get things up and running in the real world.

{% highlight zsh linenos %}

{% endhighlight %}

Okay first fire up your Linux VM and login then install the nginx webserver.

{% highlight zsh linenos %}

sudo apt-get install nginx

{% endhighlight %}

We'll use nginx as a reverse proxy for fastcgi which is what will be doing all the work. This is an exmaple of where you can find yourself getting caught out with Mono as I found a lot of the documentation referenced the fastcgi version for Mono's .NET 2.0 implementation. Anyhow, to install the correct version for this tutorial run the following command.

{% highlight zsh linenos %}

sudo apt-get install mono-fastcgi-server4

{% endhighlight %}

There are a couple of additions that need to be made to the fastcgi parameters file so run the following command to open it up in vim.

{% highlight zsh linenos %}

sudo vi /etc/nginx/fastcgi_params

{% endhighlight %}

And add the following to the file (actually I'm not sure it makes any difference if it's at the top or the bottom but I added the entries to the top). If the entires exist already then just amend them to what I have them as below.

{% highlight zsh linenos %}

fastcgi_param   PATH_INFO               "";
fastcgi_param   SCRIPT_FILENAME         $document_root$fastcgi_script_name;

{% endhighlight %}

Then save and quit using the ```!wq``` commands for vim (explained in the previous post). Great, now everything's in place for serving websites. Create a www directory for storing the websites.

{% highlight zsh linenos %}

mkdir ~/www

{% endhighlight %}

Then create a directory for a demo website itself.

{% highlight zsh linenos %}

mkdir ~/www/aspnet

{% endhighlight %}

Then create an aspx file using vim.

{% highlight zsh linenos %}

vi ~/www/aspnet/Default.aspx

{% endhighlight %}

In the vim editor paste the following code - we'll use the ubiquitous 'Hello World' for our demo page :-)

{% highlight c# linenos %}

<%@ Page AutoEventWireup="true" Language="C#" ContentType="text/plain" %>

<script runat="server">

  void Page_Load(object sender, EventArgs e)
  {
    this.Response.Write("Hello World!");
  }

</script>

{% endhighlight %}

Save the changes with the ```!wq``` vim command. Now we'll create the configuration files so the site will work with nginx. Create a new file with vim.

{% highlight zsh linenos %}

sudo vi /etc/nginx/sites-available/aspnet.conf

{% endhighlight %}

Now paste the following code into the new file and save the changes with the ```!wq``` vim command.

{% highlight zsh linenos %}

server {
        listen 80;
        server_name aspnet.mono-demo;

        location / {
                root /home/deployer/www/aspnet/;
                index index.html index.htm default.aspx Default.aspx;
                fastcgi_index Default.aspx;
                fastcgi_pass 127.0.0.1:9000;
                include /etc/nginx/fastcgi_params;
        }
}

{% endhighlight %}

The value next to ```server_name``` is your domain name. I'm using a local VM which has the name mono-demo but normally this would be the something like www.mysite.com. The other values are self explanatory although you might notice there are two entries for the default aspx web page. This is a gotcha for anyone coming from the Windows world - path and file names with different cases are treated seperately. If a user browses for Default.aspx and your file is uploaded as default.aspx the request will be treated as a 404 so you have to cater for this. 

Next create a symlink in the nginx sites-enabled folder to point to the previously created nginx config file by running the following commands.

{% highlight zsh linenos %}

sudo ln -s /etc/nginx/sites-available/aspnet.conf /etc/nginx/sites-enabled/aspnet.conf

{% endhighlight %}

Restart the nginx service so our changes are picked up.

{% highlight zsh linenos %}

sudo service nginx restart

{% endhighlight %}

Now we are finally ready to test our new web page and show some .NET code running. Run the following command.

{% highlight zsh linenos %}

fastcgi-mono-server4 /applications=/:/home/deployer/www/aspnet /socket=tcp:127.0.0.1:9000

{% endhighlight %}

If you browse to the domain entry in your aspnet.conf file you should see your web page working.

{% asset posts/20160107/2016-01-21@22.11.20-sm.jpg %}

That's all well and good but it isn't very practical to have a terminal open for each web site you want to run. This is where I started to experience some frustration as I really had to hunt around to find an adequate solution.

[This](https://fan0o.wordpress.com/2012/11/13/mono-and-nginx-for-asp-net) post pointed me in the right direction but this required putting all the configuration information for each site in the same file in the ```/etc/init.d/``` folder under root. Thankfully I came across the EPM Junkie blog which has a super helpful post [here](http://epmjunkie.com/mono-fastcgi-startup-script) which tells me everything I need. 

To tie everything up create the file ```monoserve``` by running the following command.

{% highlight zsh linenos %}

sudo vi /etc/init.d/monoserve

{% endhighlight %}

And then copy and paste the following.

{% highlight zsh linenos %}

#!/bin/bash
### BEGIN INIT INFO
# Provides: monoserve.sh
# Required-Start: $local_fs $syslog $remote_fs
# Required-Stop: $local_fs $syslog $remote_fs
# Default-Start: 2 3 4 5
# Default-Stop: 0 1 6
# Short-Description: Start FastCGI Mono server with hosts
### END INIT INFO

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/bin/mono
NAME=monoserver
DESC=monoserver

## Begin -- MAKE CHANGES HERE --
PROGRAM=fastcgi-mono-server4 # The program which will be started
ADDRESS=127.0.0.1 # The address on which the server will listen
PORT=9000 # The port on which the server will listen
USER=www-data # The user under which the process will run
GROUP=$USER # The group under which the process will run
LOGFILE=/var/log/mono/fastcgi.log
## End -- MAKE CHANGES HERE --

# Determine the environment
MONOSERVER=$(which $PROGRAM)
MONOSERVER_PID=""
FCGI_CONFIG_DIR=/home/deployer/www/mono-fastcgi # /etc/mono/fcgi/apps-enabled

# Start up the Mono server
start_up(){
    get_pid
    if [ -z "$MONOSERVER_PID" ]; then
        start-stop-daemon -S -c $USER:$GROUP -x $MONOSERVER -- --appconfigdir $FCGI_CONFIG_DIR /socket=tcp:$ADDRESS:$PORT /logfile=$LOGFILE &
        echo "Mono FastCGI Server $PROGRAM started as $USER on $ADDRESS:$PORT"
    else
        echo "Mono FastCGI Server is already running - PID $MONOSERVER_PID"
    fi
}

# Shut down the Mono server
shut_down() {
    get_pid
    if [ -n "$MONOSERVER_PID" ]; then
        kill $MONOSERVER_PID
        echo "Mono FastCGI Server stopped"
    else
        echo "Mono FastCGI Server is not running"
    fi
}

# Refresh the PID
get_pid() {
    MONOSERVER_PID=$(ps auxf | grep $PROGRAM.exe | grep -v grep | awk '{print $2}')
}

case "$1" in
    start)
        start_up
    ;;
    stop)
        shut_down
    ;;
    restart|force-reload)
        shut_down
        start_up
    ;;
    status)
        get_pid
        if [ -z "$MONOSERVER_PID" ]; then
            echo "Mono FastCGI Server is not running"
        else
            echo "Mono FastCGI Server is running - PID $MONOSERVER_PID"
        fi
    ;;
    *)
        echo "Usage: monoserve (start|stop|restart|force-reload|status)"
    ;;
esac

exit 0

{% endhighlight %}

As per the previous steps when using vim run the ```!wq``` command to save the changes. There's quite a lot going on in this file but the bits to note are the variables ```FCGI_CONFIG_DIR``` which points to a configuration file for our sites which we'll create in a minute and ```USER``` and ```GROUP``` which refer to the ```www-data``` user and group which our sites will run under and have lower level privileges and are a lot safer than running under root! To get the ```monoserve``` service to start after a reboot run the following. 

UPDATE: I'm not sure if this was a mistake on my part or if it's because I've just tried this on a new version of Ubuntu than the one used when I wrote this tutorial but this step should be done after the execute permissions are set for the file (shown in the step after). 

{% highlight zsh linenos %}

sudo update-rc.d monoserve defaults

{% endhighlight %}

Then run the following so ```monoserve``` has the correct permssions.

{% highlight zsh linenos %}

sudo chmod +x /etc/init.d/monoserve

{% endhighlight %}

There are a few gotchas referred to in the post mentioned above which are to do with folders and files not being present. We'll need to create them so run the following commands.

{% highlight zsh linenos %}

sudo mkdir /var/log/mono
sudo mkdir /var/www
sudo mkdir /var/www/.mono

{% endhighlight %}

Set the correct permissions for the ```.mono``` folder.

{% highlight zsh linenos %}

sudo chown -R www-data:www-data /var/www/.mono

{% endhighlight %}

There's also a log file that's referenced in ```monoserve``` that also needs to be created and the correct permissions set. First create the file.

{% highlight zsh linenos %}

sudo vi /var/log/mono/fastcgi.log

{% endhighlight %}

If you create a file with the ```vi filename``` command it won't save anything if you haven't added any text so hit return to add some whitespace and then save the file with the ```!wq``` command and then set the correct permissions.

{% highlight zsh linenos %}

sudo chown www-data:www-data /var/log/mono/fastcgi.log

{% endhighlight %}

The last folder we need to create for ```monoserve``` is the site configuration file so let's do that.

{% highlight zsh linenos %}

mkdir ~/www/mono-fastcgi

{% endhighlight %}

{% highlight zsh linenos %}
{% endhighlight %}
{% highlight zsh linenos %}
{% endhighlight %}

{% highlight zsh linenos %}
{% endhighlight %}

That's everything setup for ```monoserve``` we're now ready to add a site. Basically the service will check for files that are suffixed with ```.webapp``` in the ```~/www/mono-fastcgi``` folder we created earlier. So let's create one for our demo app. 

{% highlight zsh linenos %}

vi ~/www/mono-fastcgi/aspnet.webapp

{% endhighlight %}

Copy and paste the following into the text editor. The ony change you may need to make is the ```vhost``` tag which is the domain name for the site.

{% highlight xml linenos %}

<apps>
  <web-application>
    <name>aspnet</name>
    <vhost>aspnet.mono-demo</vhost>
    <vport>80</vport>
    <vpath>/</vpath>
    <path>/home/deployer/www/aspnet</path>
  </web-application>
</apps>

{% endhighlight %}

Once again run ```!wq``` to save the changes.

Now let's start the ```monoserve``` service and also restart the ```nginx``` service. 

{% highlight zsh linenos %}

sudo service monoserve start
sudo service nginx restart

{% endhighlight %}

That's it! If you browse to the domain you set up for the site it should now view in the browser.

You can manage ```monoserve``` the same as any service by using the following commands.

{% highlight zsh linenos %}

sudo service monoserve start
sudo service monoserve restart
sudo service monoserve stop

{% endhighlight %}

Everything is now in place to add more sites without too much fuss. A quick check list of the files you'll need to get a new site working with ```monoserve``` is below.

{% highlight zsh linenos %}

# nginx site-name config file
/etc/nginx/sites-available/site-name.conf

# symlink to /etc/nginx/sites-available/site-name.conf
/etc/nginx/sites-enabled/site-name.conf

# monoserve site-name config file
~/www/mono-fastcgi/site-name.webapp

# restart monoserve
sudo service monoserve restart

# restart nginx
sudo service monoserve restart

{% endhighlight %}

That's the end of this tutorial. I think it's fairly instructive for getting something up and running that can be used in production. There are a couple of things I haven't gone through to help with the work process but I'll likely be documenting these at a later date and they are somewhat out of the scope of what we're discussing here. Please add any comments below :-)

UPDATE 2: A new issue has come up as per [this](http://stackoverflow.com/questions/24872394/access-to-the-path-etc-mono-registry-is-denied) Stack Overflow question. It was easily resolved by running the following commands but I've put it here as it's another gotcha to look out for.

{% highlight zsh linenos %}

sudo mkdir /etc/mono/registry
sudo chmod uog+rw /etc/mono/registry

{% endhighlight %}

UPDATE 3 (2017-03-29): I just tried to set this up on a Digital Ocean VM and had a problem when i ran the ```sudo update-rc.d monoserve defaults``` command. This calls Perl and there was an issue with the locale settings. I found various solutions but the simplest seemed to be to reinstall the required packages with the following.

{% highlight zsh linenos %}

sudo apt-get install --reinstall locales && sudo dpkg-reconfigure locales

{% endhighlight %}
