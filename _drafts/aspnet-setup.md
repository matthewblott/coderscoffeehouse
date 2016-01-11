
{% highlight bash %}
{% endhighlight %}



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
