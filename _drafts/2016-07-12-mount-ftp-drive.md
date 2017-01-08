---
layout: post
title:  "Mount FTP drive"
date:   2016-07-12 00:00:00
categories: tech
---


# FTP Share

sudo apt-get install curlftpfs

Link the FTP folder with the following commands.


# you may need to enclose password in quotation marks but if that's the case it is probably best to use a different password if possible
sudo mkdir /media/dirname
sudo curlftpfs ftp.yourserver.com /media/dirname/ -o user=username:password,allow_other,uid=1001,gid=1001


sudo vim /etc/fstab
curlftpfs#username:[password]@domain/ /media/storefront fuse auto,user,uid=1001,gid=1001,allow_other,_netdev 0

# run the following to check, you should be able to view the added ftp directory
mount -a


# Windows Share

sudo apt-get install cifs-utils

sudo mkdir /media/win-dirname

# create a credentials file for the windows user
vim ~/.smbcredentials
username=username
password=password
domain=CDL

sudo vim /etc/fstab

//windows/share /media/win-dirname cifs credentials=/home/deployer/.smbcredentials,uid=deployer,gid=deployer,file_mode=0660,dir_mode=0770,iocharset=utf8,sec=ntlm 0 0



# SSH Share

sshfs
=====

sudo apt-get install sshfs




# unmount
umount /media/dirname

sudo sshfs -o allow_other,identityfile=/home/deployer/.ssh/id_rsa,uid=1001,gid=1001 deployer@webserver:/home/deployer/www/cdl-assets/ /media/cdl-assets