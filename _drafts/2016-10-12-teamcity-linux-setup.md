install java

see

http://blog.fire-development.com/2014/09/23/teamcity-8-setup-on-linux/

http://ubuntuhandbook.org/index.php/2015/01/install-openjdk-8-ubuntu-14-04-12-04-lts/

# add the package (hit enter when prompted
sudo add-apt-repository ppa:openjdk-r/ppa

# update and install
sudo apt-get update
sudo apt-get install openjdk-8-jre

# Move to the opt folder as that's where we're going to be installing TeamCity
cd /opt

# Download team city 
sudo wget https://download-cf.jetbrains.com/teamcity/TeamCity-10.0.2.tar.gz

# extract the package - you'll need to use sudo so the files and directories can be created.
sudo tar -xzvf TeamCity-10.0.2.tar.gz

# start the TeamCity server 
# sudo /opt/TeamCity/bin/teamcity-server.sh start
sudo ./opt/TeamCity/bin/runAll.sh start

# allow port 8111 on your firewall
sudo ufw allow 8111

# Now browse to your server IP or name using port 8111. WARNING: This process can take forever, my browser was hanging for at least a couple of minutes before I could see anything
picture of server

# this is a good time to change the data directory
/opt/TeamCity/.BuildServer

create database teamcity;
create user 'teamcity'@'%' identified by 'password';
grant all privileges on teamcity.* to 'teamcity'@'%';

# config for ubuntu
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
change bind-address = 127.0.0.1 to bind-address = 0.0.0.0
sudo systemctl restart mysql.service


# TeamCity database config located
/opt/TeamCity/.BuildServer/config/database.properties

# install MySQL
https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04

sudo apt-get install

# The following should be straightfoward but I've hit an issue with each of my Digital Ocean Ubuntu machines with the Perl scripting files for the locale settings. I fixed these by reinstalling the packages
sudo locale-gen
sudo dpkg-reconfigure locales


# Download the packag
http://www.codingpedia.org/ama/how-to-install-mysql-server-5-7-on-ubuntu-16-04

# Download and install the correct package
wget http://dev.mysql.com/get/mysql-apt-config_0.8.1-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.1-1_all.deb

# Fix the key issue
sudo apt-key adv --keyserver pgp.mit.edu --recv-keys A4A9406876FCBD3C456770C88C718D3B5072E1F5

# now install
sudo apt-get install mysql-server



# follow the instructions
sudo apt-get update


# this last part is optional
sudo mysql_secure_installation


# useful for stats
ps -ef | grep java
netstat -anp | grep java


mysql



# Next we need to setup a database. TeamCity comes with its own database HSQLDB which is apparently good enough for most people's needs but its not a platform I'm familiar with and I like the idea of being able to query a familiar RDBMS and all the major systems are supported. With SQL Server now able to run on Linux I should probably try that but here I'm going to use MySQL.

https://confluence.jetbrains.com/display/TCD9/Setting+up+an+External+Database

# First download the MySQL Java connector
wget http://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.40.tar.gz

# Extract the package
tar -xzvf mysql-connector-java-5.1.40.tar.gz

# The connector goes in the root folder so we need to be running under root.
sudo -i

# Now move the connector. My typical user is deployer but you might be running under something different.
mv /home/deployer/mysql-connector-java-5.1.40 /root/.BuildServer/lib/jdbc/mysql-connector-java-5.1.40


browse
http://ubuntu:8111/




# optional nginx
sudo apt-get install nginx

sudo vim /etc/nginx/sites-available/teamcity

# display file contents

sudo ln -s /etc/nginx/sites-available/teamcity /etc/nginx/sites-enabled/teamcity


# SERVICE
sudo vim /etc/init.d/teamcity

# enter contents

# make file executable
sudo chmod +x /etc/init.d/teamcity

# register as startup script
sudo update-rc.d teamcity defaults


# MySQL

create database <database-name> collate utf8_bin;
create user <user-name> identified by '<password>';
grant all privileges on <database-name>.* to <user-name>;
grant process on *.* to <user-name>;
