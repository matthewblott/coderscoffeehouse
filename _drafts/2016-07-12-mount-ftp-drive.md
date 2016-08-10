---
layout: post
title:  "Mount FTP drive"
date:   2016-07-12 00:00:00
categories: tech
---

sudo apt-get install curlftpfs

Link the FTP folder with the following commands.


# you may need to enclose password in quotation marks but if that's the case it is probably best to use a different password if possible
sudo mkdir /media/dirname
sudo curlftpfs ftp.yourserver.com /media/dirname/ -o user=username:password,allow_other,uid=1001,gid=1001


vim /etc/fstab
curlftpfs#username:[password]@domain/ /media/storefront fuse auto,user,uid=1001,gid=1001,allow_other,_netdev 0 0


H/T https://wiki.archlinux.org/index.php/CurlFtpFS


# unmount
umount /media/dirname


sshfs
=====

sudo apt-get install sshfs


sudo sshfs -o allow_other,identityfile=/home/deployer/.ssh/id_rsa,uid=1001,gid=1001 deployer@webserver:/home/deployer/www/cdl-assets/ /media/cdl-assets
