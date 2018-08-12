---
layout: post
title:  Dropbox Linix Install
date:   2017-12-04 00:00:00
categories: tech
---

https://www.dropbox.com/en_GB/install-linux

# download dropbox

cd ~

wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -

Then run

~/.dropbox-dist/dropboxd

If you check the terminal you'll see something like the following ...

[img]

Copy and paste the link that appears in the terminal window. You'll then be prompted to sign into your DropBox account. Once signed in the server will be added to the list of trusted devices. Your list of devices can be found here:

https://www.dropbox.com/account/security

If you look in the terminal you should then see that the client has synced with your DropBox account.

[img]


The daemon is located ...

~/.dropbox-dist/dropboxd

So this runs in the background add it as a job that starts after reboot using ```crontab -e```.

@reboot ~/.dropbox-dist/dropboxd



To manage the client download the following Python script.

https://www.dropbox.com/download?dl=packages/dropbox.py

You can then run the following.

python dropbox.py

This will present you with the list of available commands. You then append the command you want to run to the above example. So, to view the status you would do the following.

python dropbox.py status


Then ...

chmod +x dropbox.py

mv dropbox.py /opt/dropbox/dropbox.py

sudo ln -s /opt/dropbox/dropbox.py /usr/local/bin/dropbox
