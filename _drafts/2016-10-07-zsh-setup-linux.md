---
layout: post
title:  ZSH Setup on Linux
date:   2016-10-07 00:00:00
categories: tech
---

# set hostname
hostnamectl set-hostname hostname

/etc/hosts
127.0.1.1 hostname

## update
apt update
apt upgrade

## create user
adduser deployer
usermod -aG sudo deployer

# logout from root and login as new user then generate ssh key
ssh-keygen

# then on local machine
ssh-copy-id deployer@hostname

# Disable root login and password based login
sudo vim /etc/ssh/sshd_config

ChallengeResponseAuthentication no
PasswordAuthentication no
UsePAM no
PermitRootLogin no
PermitRootLogin prohibit-password
AllowUsers deployer
AcceptEnv LANG LC_* # comment this out

sudo systemctl restart sshd


## docker install
sudo apt install apt-transport-https ca-certificates curl gnupg -y gnupg2 -y lsb-release

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  
sudo apt update
sudo apt install docker-ce -y docker-ce-cli containerd.io

## docker-compose install
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose


### docker bash completion (see different for zsh)
sudo curl \
    -L https://raw.githubusercontent.com/docker/compose/1.29.2/contrib/completion/bash/docker-compose \
    -o /etc/bash_completion.d/docker-compose


## docker rootless requirements
sudo apt install uidmap -y dbus-user-session -y slirp4netns fuse-overlayfs -y

## disable system docker if it's running
sudo systemctl disable --now docker.service docker.socket

## docker rootless install (follow every step carefully)
 # run on the command line, don't need to add this to .bashrc but may wish to
export XDG_RUNTIME_DIR=/run/user/$UID

dockerd-rootless-setuptool.sh install

 # add to .bashrc
export PATH=/usr/bin:$PATH
export DOCKER_HOST=unix:///run/user/1000/docker.sock

systemctl --user start docker
systemctl --user enable docker
sudo loginctl enable-linger $(whoami)

sudo vim /etc/sysctl.conf
net.ipv4.ip_unprivileged_port_start=0

 # debian 10 and below
kernel.unprivileged_userns_clone=1 

sudo sysctl --system
sudo reboot

docker run hello-world


# install necessary
sudo apt install fail2ban ufw

# install useful
sudo apt install pwgen
sudo apt install fd-find
ln -s $(which fdfind) ~/.local/bin/fd


# textmate / sublime
sudo wget -O /usr/local/bin/rmate https://raw.githubusercontent.com/aurora/rmate/master/rmate
sudo chmod a+x /usr/local/bin/rmate

# install homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"


# turn off ipv6 for ufw
sudo vim /etc/default/ufw
IPV6=no

# zsh requirements
sudo apt zsh git-core

# install zsh
Helpful post
https://gist.github.com/tsabat/1498393

sudo wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh

# make zsh the default shell
chsh -s `which zsh`

# standard zsh files (for reference)
~/.zshenv
~/.zshrc
~/.zlogin
~/.zprofile.zlogout
~/.oh-my-zsh/themes # oh-my-zsh themes folder



# create .zsh_path
touch ~/.zsh_path
vim ~/.zsh_path

# then paste the following

PATH=""
PATH="$PATH/usr/local/sbin:"
PATH="$PATH/usr/local/bin:"
PATH="$PATH/usr/sbin:"
PATH="$PATH/usr/bin:"
PATH="$PATH/sbin:"
PATH="$PATH/bin:"
PATH="$PATH/usr/games:"
PATH="$PATH/usr/local/games"


# Create .zsh_keys
touch ~/.zsh_keys

# then paste in any keys
export key_ssh_password=password
export key_mssql_password=password


# create .zsh_function
touch ~/.zsh_functions


# create .zsh_aliases
touch ~/.zsh_aliases


alias home='cd ~'
alias ip='host myip.opendns.com resolver1.opendns.com'


# create .zshrc
rm .zshrc # delete default file
touch .zshrc

then paste the following
# update
DISABLE_AUTO_UPDATE=true # essential in production!

# theme
ZSH_THEME="robbyrussell"

# plugins
plugins=(git, jump)

# path
. ~/.zsh_path

# zsh
export ZSH=/home/deployer/.oh-my-zsh
source $ZSH/oh-my-zsh.sh

### useful cli tools
brew install exa dust bat tldr fd curlie procs pandoc teamookla/speedtest rg # rip grep
swaks # test smtp


# passwords
. ~/.zsh_keys

# functions
. ~/.zsh_functions

# aliases
. ~/.zsh_aliases


# vim

sudo update-alternatives --config editor # ?

export EDITOR=vim # makes it the default editor, useful when using crontab

# default location for installed default themes (for reference)
/usr/share/vim/vimrc[version]/colors


mkdir ~/.vim/colors


# add the following file to ~/.vim/colors


# install https://github.com/sickill/vim-monokai/blob/master/colors/monokai.vim
curl -O https://raw.githubusercontent.com/crusoexia/vim-monokai/master/colors/monokai.vim

# create .vimrc

touch ~/.vimrc
vim ~/.vimrc

colorscheme scheme_name
syntax on

# change default sudo timeout (if desired)
sudo visudo
# search for "Defaults env_reset" and change it to below
Defaults env_reset,timestamp_timeout=30
# N.B. change to -1 above if you never wish the password to expire


pbcopy
======

# -- OLD
# alias
alias permissions-644='find . -type f -exec chmod 644 {} +'
# jump
function _completemarks {
  reply=($(ls $MARKPATH))
}
# compctl may need to install plugin for this
compctl -K _completemarks jump
compctl -K _completemarks unmark
# -- END OLD



