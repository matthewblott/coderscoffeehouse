---
layout: post
title:  "ASP.NET Linux Setup"
date:   2015-12-09 13:14:00
categories: tech
---

I started playing around with Linux a couple of years ago as I had some customer requirements that didn't fit with the Windows. It wasn't soon after that I decided to make the switch permanent and although I've enjoyed playing with new languages and frameworks as someone who has primarily been a .NET developer I've not found the ride entirely smooth. The biggest frustration is the fact Windows dominates .NET even with the announcement (some time ago now) that it would have official MS support for cross platform compatibility. There's a real dearth of tutorials and I've had to hunt about for scraps of information with little in the way of an end to end tutorial for building and deploying an app from development to production. So I decided to put together what I've learned (as much for my own reference as it is for others) and hopefully it can be of help to some like myself who are coming from the world of Windows GUI snap in consoles to the cold world of the Linux terminal. 

The first part of this series will be setting up a Linux VM. For this demo I'm using Parallels on my Mac but you could just as easily use VirtualBox. I'm using Ubuntu Sever 14.04 because Ubuntu seems to be the best supported and 14.04 is the most recent LTS version.

Usually when I setup a VM I name the server the same name as its OS but I already have one on my machine called ubuntu so I'll call this one mono-demo.

![](/images/2016-01-07/...mono-demo.jpg)

Then I just go through the defaults until prompted for a user which I call 'deployer' and give a simple password.

![](/images/2016-01-07/..deployer-user.jpg)

And then continue until prompted for the software selection. The only one I tick here is OpenSSH as otherwise I'll only be able to login to the machine directly. If you're using a VM on a cloud platform then you'll need to use SSH (for my part I find Parallels doesn't play very well when you access the Linux VM directly as the keys get 'sticky').

![](/images/2016-01-07/...open ssh.jpg)

If you've skipped ahead and didn't tick OpenSSH you can always install it after with the following commannd:

sudo apt-get install openssh-server

That's the end of the process for creating the server. Once the sever boots login with the credentails you created during setup (in my case the user 'deployer') so we're ready to install the required packages.

First we'll install the firewall so run the following from the terminal:

sudo apt-get install ufw  

TODO: include opening up port 22, and 80

Now we'll install mono itself. The process is pretty simple and the documentation on the website is pretty good but for completeness I'll include the steps here. First run the following commands:

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb http://download.mono-project.com/repo/debian wheezy main" | sudo tee /etc/apt/sources.list.d/mono-xamarin.list
sudo apt-get update 

If you're using a different version of Ubuntu from the one here (14.04) there may be some additonal steps but if not then just run the followong: 

sudo apt-get install mono-devel
sudo apt-get install mono-complete

There are a couple of other packages that are recommended, the first will prevent some framework errors and the latter is for SSL:

sudo apt-get install referenceassemblies-pcl
sudo apt-get install ca-certificates-mono

That's the mono installation complete. You can run the following which will print the mono details to the terminal:

mono --version

run mcs


PART 2 ASP.NET Setup

Next install the webserver nginx:

sudo apt-get install nginx



# for aspnet
sudo apt-get install mono-fastcgi-server4

3. Configure fastcgi_params

vim /etc/nginx/fastcgi_params

# add the following to the file (or amend if the entries already exist) 

fastcgi_param   PATH_INFO               "";
fastcgi_param   SCRIPT_FILENAME         $document_root$fastcgi_script_name;

4. Create site in ~/www/aspnet

5. Create ngnix config file in /etc/nginx/sites-available/aspnet.conf 

server {
        listen 80;
        server_name aspnet.digitalprintingdirect.uk;

        location / {
                root /home/deployer/www/aspnet/;
                index index.html index.htm default.aspx Default.aspx;
                fastcgi_index Default.aspx;
                fastcgi_pass 127.0.0.1:9000;
                include /etc/nginx/fastcgi_params;
        }
}

X. Create sym link in /etc/ngnix/sites-enabled

sudo ln -s /etc/nginx/sites-available/aspnet.conf aspnet.conf


x. Test fast cgi is working with nginx and aspnet by running the following command.

fastcgi-mono-server4 /applications=aspnet.digitalprintingdirect.uk:/:/home/deployer/www/aspnet/ /socket=tcp:127.0.0.1:9000 /logfile=/var/log/mono/fastcgi.log /printlog=True

X. Create config file for mono

vim /etc/init.d/mono

IMPORTANT Start the server
sudo /etc/init.d/mono start

Make sure the file has the correct permissions

chmod 