---
layout: post
title:  Linux Cheat Sheet
date:   2017-10-11 00:00:00
categories: tech
---

User Management
---------------

### New user

{% highlight shell linenos %}

adduser deployer

{% endhighlight %}


### Give User Root Privileges

{% highlight shell linenos %}

sudo usermod -a -G sudo deployer

{% endhighlight %}

### Add an existing user to a group

The ```-a``` switch is for appending.

{% highlight shell linenos %}

usermod -a -G groupname username

{% endhighlight %}

### Remove an existing user from a group

This will NOT delete the user if the second argument ( ```groupname``` ) is included as shown below.

{% highlight shell linenos %}

deluser username groupname

{% endhighlight %}


SSH
---

### Remote Login

On the remove machine.

{% highlight shell linenos %}

ssh-keygen

{% endhighlight %}

On the local machine.

ssh-copy-id user@server

Further reading (including initial user setup) [here](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04).

### Known Hosts

#### Remove offending key

If the key changes on the server and you attempt to sign in from a client you'll get an error similar to the following.

{% highlight shell linenos %}

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@       WARNING: POSSIBLE DNS SPOOFING DETECTED!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
The RSA host key for foo-bar.net has changed,
and the key for the corresponding IP address 127.0.0.1
is unchanged. This could either mean that
DNS SPOOFING is happening or the IP address for the host
and its host key have changed at the same time.
Offending key for IP in /home/user/.ssh/known_hosts:6
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!

{% endhighlight %}

The above tells you line 6 is the offending line which needs to be removed. Just open a text editor and remove it (be careful to backup your file before).

Services
--------

### Service Symbolic Links

When a ```systemctl``` service is enabled as follows.

{% highlight shell linenos %}

sudo systemctl enable name_of.service

{% endhighlight %}

Then a corresponding symlink is created as follows.

{% highlight shell linenos %}

/etc/systemd/system/multi-user.target.wants.name_of.service

{% endhighlight %}

If a ```servicectl``` service is removed then this look should be deleted.

## OS

### Disk Space

{% highlight shell linenos %}

df -h

{% endhighlight %}

## File System

### Recursive Ownership

{% highlight shell linenos %}

chown user:group /path/to/folder -R

{% endhighlight %}

### Filesystem Hierarchy Standard

The correct way to link binaries, the following is an example for SQL Server tools.

{% highlight shell linenos %}

sudo ln -s /opt/mssql-tools/bin/* /usr/local/bin/

{% endhighlight %}


### Copy file one server to another

{% highlight shell linenos %}

# copy file
scp user@server:filename /some/local/path

# copy directory
scp -Cr user@server:/path/to/dir /some/local/path

{% endhighlight %}


### FTP

FTP operations can be performed in a nubmer of ways but one simple way is to use ```curl```.

To download a file.

{% highlight shell linenos %}

curl ftp://domain.com/filename --user username:password -o filename

{% endhighlight %}


#### Download Latest File

{% highlight shell linenos %}

# obtain file list
curl ftp://domain.com --user username:password --list-only > files.txt

# get the last entry
file="$(tail -n 1 files.txt)"

# download the file
curl ftp://domain.com/filename --user username:password -o filename

{% endhighlight %}

General Tasks
-------------

### Repositories

Edit source list.

{% highlight shell linenos %}

sudo vim /etc/apt/sources.list

{% endhighlight %}

List additional sources.

{% highlight shell linenos %}

ll /etc/apt/sources.list.d

{% endhighlight %}


### Visudo Editor

Change the ```visudo``` editor

{% highlight shell linenos %}

sudo update-alternatives --config editor

{% endhighlight %}

### Sudoless Scripting

Sometimes there's a need to run a script without using the ```sudo``` prefix. For example a deployment script for a web app might need to change the ownership of an ```uploads``` directory to ```www-data```. This requires ```chown``` which in turn needs ```sudo```. To get round this a record can be added to ```visudo``` which points to the script bypassing the need to use ```sudo```.

So first open the editor.

{% highlight shell linenos %}

sudo visudo

{% endhighlight %}

Then go to the end of the file and add a in a line similar to the one below for the script you wish to bypass using ```sudo``` (in this instance I'm doing this for the user ```deployer```).

{% highlight shell linenos %}

deployer ALL=(root) NOPASSWD: /home/deployer/path-to-script.sh

{% endhighlight %}

Note that it is not necessary to use ```sudo``` before any commands in your script file (```chown``` for example) but you need to use ```sudo``` before executing the script as shown below.

{% highlight shell linenos %}

sudo /home/deployer/path-to-script.sh

{% endhighlight %}

The above script will execute without prompting for a password and ```bash``` commands that require ```sudo``` in the file will work as expected.


