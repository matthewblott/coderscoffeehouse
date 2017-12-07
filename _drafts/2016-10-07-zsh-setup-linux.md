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

IMPORTANT: Turn off auto update by adding the following to .zshrc
DISABLE_AUTO_UPDATE=true

Key files

# zsh files
.zshenv
.zshrc
.zlogin
.zprofile.zlogout

# oh-my-zsh themes folder
~/.oh-my-zsh/themes

Create .zshrc
=============
Delete the existing .zshrc file and make a new file with the following settings ...

# update
DISABLE_AUTO_UPDATE=true

# keys
export key_ssh_password=password
export key_mssql_password=password

# theme
ZSH_THEME="robbyrussell"

# plugins
plugins=(git, jump)

# path
PATH=""
PATH="$PATH/usr/local/sbin:"
PATH="$PATH/usr/local/bin:"
PATH="$PATH/usr/sbin:"
PATH="$PATH/usr/bin:"
PATH="$PATH/sbin:"
PATH="$PATH/bin:"
PATH="$PATH/usr/games:"
PATH="$PATH/usr/local/games"

# zsh
export ZSH=/home/deployer/.oh-my-zsh

# source
source $ZSH/oh-my-zsh.sh

# alias
alias permissions-644='find . -type f -exec chmod 644 {} +'
alias home='cd ~'

# jump
function _completemarks {
  reply=($(ls $MARKPATH))
}

# compctl may need to install plugin for this
compctl -K _completemarks jump
compctl -K _completemarks unmark

# vim

sudo update-alternatives --config editor

export EDITOR=vim # makes it the default editor, userful when using crontab
mkdir ~/.vim/colors

add the following file to ~/.vim/colors

default location for installed default themes
/usr/share/vim/vim[version]/colors

https://github.com/sickill/vim-monokai/blob/master/colors/monokai.vim
https://raw.githubusercontent.com/crusoexia/vim-monokai/master/colors/monokai.vim

# edit ~/.vimrc
colorscheme scheme_name
syntax on

# change default sudo timeout (if desired)
sudo visudo
# search for "Defaults env_reset" and change it to below
Defaults env_reset,timestamp_timeout=30
# N.B. change to -1 above if you never wish the password to expire


pbcopy
======
