---
layout: post
title:  ZSH Setup on Linux
date:   2016-10-07 00:00:00
categories: tech
---

Helpful post
https://gist.github.com/tsabat/1498393

sudo apt-get install zsh
sudo apt-get install git-core

Install ...

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



