---
layout: post
title:  TeamCity Linux Setup
date:   2017-04-07 00:00:00
categories: tech
---

Another one in my .NET / Linux series :-)

So, TeamCity seems to be the de facto build server in the .NET world and we want install it on Linux. I thought this would be straightforward - after all it's written in Java which runs pretty well on Linux so I shouldn't have any problem. Well, I've got it running but it's not as simple as I'd hoped so here are the steps you'll need to go through.

For this exercise I created a new VM running Ubuntu 16.04.2 LTS with nothing installed.

Install Java
------------

Add the package repository and install.

{% highlight shell linenos %}
sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get install openjdk-8-jre
{% endhighlight %}

Check Java is installed with the following.

{% highlight shell linenos %}
java -version
{% endhighlight %}

You should see something like the following in the terminal.

{% highlight shell linenos %}
openjdk version "1.8.0_121"
{% endhighlight %}

Setup MySQL
-----------

TeamCity comes bundled with a Java based database called HSQLDB but it supports all the major RDBMS systems. I'm going to use MySQL here. So the next step is to install it.

{% highlight shell linenos %}
sudo apt-get update
sudo apt-get install mysql-server
{% endhighlight %}

Check it's installed.

{% highlight shell linenos %}
mysql --version
{% endhighlight %}

You should see some like the following in the terminal.

{% highlight shell linenos %}
mysql  Ver 14.14 Distrib 5.7.17, for Linux (x86_64)
{% endhighlight %}

Login to MySQL and create the database and user.

{% highlight sql linenos %}
create database teamcity collate utf8_bin;
create user teamcity identified by 'password';
grant all privileges on teamcity.* to teamcity;
grant process on *.* to teamcity;
{% endhighlight %}

Install TeamCity
----------------

Move to the opt folder as that's where we're going to install TeamCity (I'm just following convention here).

{% highlight shell linenos %}
cd /opt
{% endhighlight %}

Download and extract the TeamCity package.

{% highlight shell linenos %}
sudo wget https://download-cf.jetbrains.com/teamcity/TeamCity-10.0.2.tar.gz
sudo tar -xzvf TeamCity-10.0.2.tar.gz
{% endhighlight %}

There should now be an ```/opt/TeamCity``` directory. Create an application user and set the appropriate permissions.


{% highlight shell linenos %}
sudo useradd teamcity
sudo chown -R teamcity:teamcity /opt/TeamCity
{% endhighlight %}

Create the service
----------------

This is simple enough. Create the service file.

{% highlight shell linenos %}
sudo vim /etc/init.d/teamcity
{% endhighlight %}

Copy and paste the following then save the file.

{% highlight shell linenos %}

export TEAMCITY_DATA_PATH="/opt/TeamCity/.BuildServer"

case $1 in
  start)
    echo "Starting Team City"
    start-stop-daemon --start  -c teamcity --exec /opt/TeamCity/bin/teamcity-server.sh start
    ;;
  stop)
    echo "Stopping Team City"
    start-stop-daemon --start -c teamcity  --exec  /opt/TeamCity/bin/teamcity-server.sh stop
    ;;
  restart)
    echo "Restarting Team City"
    start-stop-daemon --start  -c teamcity --exec /opt/TeamCity/bin/teamcity-server.sh stop
    start-stop-daemon --start  -c teamcity --exec /opt/TeamCity/bin/teamcity-server.sh start
    ;;
  *)
    echo "Usage: /etc/init.d/teamcity {start|stop|restart}"
    exit 1
    ;;
esac

exit 0

{% endhighlight %}

Register as a startup script.

{% highlight shell linenos %}
sudo update-rc.d teamcity defaults
{% endhighlight %}

Make the file executable.

{% highlight shell linenos %}
sudo chmod +x /etc/init.d/teamcity
{% endhighlight %}

And start the service.

{% highlight shell linenos %}
sudo serivce teamcity start
{% endhighlight %}

Now if you browse to the IP address of your server using port 8111 you should see the TeamCity web interface.

![]({% asset_path posts/20170407/235832-md.jpg %})

Here you're prompted to enter where you want your data directory. The convention seems to be within your installation which is what I've gone with here.

Click proceed and then you'll be prompted to fill out the details for the database. You don't need to fill in the host if you've done a local installation as we have in this tutorial (this screenshot was taken for another installation I have). 

![]({% asset_path posts/20170407/08-md.jpg %})

At this point if you fill out the details and click Proceed you'll get an error.

![]({% asset_path posts/20170407/122326-md.jpg %})

Unfortunately this is because the Java MySQL connector needs to be installed. But this was still a useful exercise as the data directory and some of the system files were created during this process. And this was needed as we are going to put the connector in one of these directories.


First stop the service.

{% highlight shell linenos %}
sudo service teamcity start
{% endhighlight %}

Move to ```opts``` directory if you're not there already.

{% highlight shell linenos %}
cd /opt
{% endhighlight %}

Download the MySQL Java connector and extract the package.

{% highlight shell linenos %}
sudo wget http://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.40.tar.gz
sudo tar -xzvf mysql-connector-java-5.1.40.tar.gz
{% endhighlight %}

Move the file to the required destination.

{% highlight shell linenos %}
sudo mv /opt/mysql-connector-java-5.1.40/mysql-connector-java-5.1.40-bin.jar /opt/TeamCity/.BuildServer/lib/jdbc/
{% endhighlight %}

We'll need to set permissions so the file runs under the ```teamcity``` account we created earlier.

{% highlight shell linenos %}
sudo chown teamcity:teamcity /opt/TeamCity/.BuildServer/lib/jdbc/mysql-connector-java-5.1.40-bin.jar
{% endhighlight %}

Start the service again.

{% highlight shell linenos %}
sudo service teamcity start
{% endhighlight %}

Now open a browser and fill out the MySQL details as before then click Proceed. At this point you might want to go and make a cup of tea or take the dog for a walk - it really can take some time and you might think it's crashed. Eventually you'll come to the license agreement page. Tick the accept check box and click Continue.

![]({% asset_path posts/20170407/37-md.jpg %})

Proceed and create an admin account and you're good to go.

![]({% asset_path posts/20170407/49-md.jpg %})

Setup nginx
-----------

The next step is optional but pretty straightforward enough. We're going to install ```nginx``` so we can browse using port 80.

First install ```nginx``` as so.

{% highlight shell linenos %}
sudo apt-get install nginx
{% endhighlight %}

Then create the config file for the site.

{% highlight shell linenos %}
sudo vim /etc/nginx/sites-available/teamcity
{% endhighlight %}

Paste the following in - swap ```intercrus``` in the example below for whatever your domain name is.


{% highlight shell linenos %}

map $http_upgrade $connection_upgrade {
    default upgrade;
    ''   '';
}

server {

    listen       80;
    server_name  localhost intercrus;

    proxy_read_timeout     1200;
    proxy_connect_timeout  240;
    client_max_body_size   0;

    location / {

        proxy_pass          http://localhost:8111/;
        proxy_http_version  1.1;
        proxy_set_header    X-Forwarded-For $remote_addr;
        proxy_set_header    Host $server_name:$server_port;
        proxy_set_header    Upgrade $http_upgrade;
        proxy_set_header    Connection $connection_upgrade;
    }
}

{% endhighlight %}

Create a symlink for the new site.

{% highlight shell linenos %}
sudo ln -s /etc/nginx/sites-available/teamcity /etc/nginx/sites-enabled/teamcity
{% endhighlight %}

Restart the ```nginx``` service.


{% highlight shell linenos %}
sudo service nginx restart
{% endhighlight %}

Now if you browse to the same address under port 80 you should see the login page as shown below.

![]({% asset_path posts/20170407/000335-md.jpg %})

A couple of final points.

1. There's a serious issue with the startup time of TeamCity as explained [here](https://youtrack.jetbrains.com/issue/TW-41035). I've found once it's up it's 'okay' but I think you really need a decent spec machine to run it on in a production environment.

2. I had some real issues with the MySQL installation. I haven't documented it here as it's somewhat out the scope of this tutorial but it seems to be a problem with the latest version of Ubuntu - it's probably best to direct the package directly when doing an installation.

That's it :-)

Links ...

http://blog.fire-development.com/2014/09/23/teamcity-8-setup-on-linux/
http://ubuntuhandbook.org/index.php/2015/01/install-openjdk-8-ubuntu-14-04-12-04-lts/
https://confluence.jetbrains.com/display/TCD9/Setting+up+an+External+Database
https://gist.github.com/sandcastle/9282638
