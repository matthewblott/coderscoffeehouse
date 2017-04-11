---
layout: post
title:  Managing Linux Services
date:   2017-03-29 00:00:00
categories: tech
---

Manage services with the ```update-rc.d``` command.

# list
service --status-all

# create the service file
sudo vi /etc/init.d/service_name

# write the service

# add
sudo update-rc.d service_name defaults

# remove (make sure the file itself has been removed)
sudo rm /etc/init.d/service_name
sudo update-rc.d service_name remove





