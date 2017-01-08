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

wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh


Change shell
chsh -s `which zsh`

IMPORTANT: Turn off auto updat by adding the following to .zshrc
DISABLE_AUTO_UPDATE=true


Full changes I make ...

# update
DISABLE_AUTO_UPDATE=true

# keys
export key_somepassword=password

# zsh
export ZSH=/home/deployer/.oh-my-zsh

# theme
ZSH_THEME="robbyrussell"

# plugins
plugins=(git, jump)

# path
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games"
source $ZSH/oh-my-zsh.sh

# alias
alias permissions-644='find . -type f -exec chmod 644 {} +'
alias j=jump
alias ls='ls -l'

# jump
function _completemarks {
  reply=($(ls $MARKPATH))
}

compctl -K _completemarks jump
compctl -K _completemarks unmark

# crontab
export EDITOR=vim