install java

see
http://ubuntuhandbook.org/index.php/2015/01/install-openjdk-8-ubuntu-14-04-12-04-lts/

sudo add-apt-repository ppa:openjdk-r/ppa
sudo apt-get update
sudo apt-get install openjdk-8-jre


download 

wget https://download-cf.jetbrains.com/teamcity/TeamCity-10.0.2.tar.gz

sudo mv TeamCity-10.0.2.tar.gz /opt
sudo xvf TeamCity-10.0.2.tar.gz

cd /opt/TeamCity/bin

sudo /opt/TeamCity/bin/teamcity-server.sh start

sudo ufw allow 8111/tcp

ps -ef | grep java

netstat -anp | grep java


mysql

see
https://confluence.jetbrains.com/display/TCD9/Setting+up+an+External+Database

download
wget http://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.40.tar.gz

tar xvf mysql-connector-java-5.1.40.tar.gz

cd mysql-connector-java-5.1.40

sudo su -
mv mysql-connector-java-5.1.40 /root/.BuildServer/lib/jdbc/mysql-connector-java-5.1.40


browse
http://ubuntu:8111/