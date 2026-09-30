---
date: "2020-02-01"
tags:
  - Windows
  - Rails
---

# Windows10 Rails开发环境搭建

气抖冷，Windows什么时候才能快速地搞Ruby？本文通过Windows10的WSL功能（实际上还不是在拿Linux搞）研究Rails

## 系统要求

- CPU支持并且开启虚拟化
- Windows 10 x64 版本 >= 18917
- 电脑配置好点（这玩意用的虚拟化，说白了就是个虚拟机，占用较大的内存）

## 第一步 - 打开WSL2

参照[Microsoft Docs](https://docs.microsoft.com/zh-cn/windows/wsl/wsl2-install)

首先，请在系统设置里开启开发者模式

```bash
# 以管理员身份打开Powershell
> dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
> dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 重庆电脑，配置新功能需要一点时间
> wsl --set-default-version 2
```

之后，安装[Ubuntu WSL](https://www.microsoft.com/zh-cn/p/ubuntu/9nblggh4msv6)

## 第二步 - 配套环境

个人非常建议使用[VS Code](https://code.visualstudio.com/)以及配套的[Remote扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

默认的终端太丑了，建议使用[Fluent Terminal](https://github.com/felixse/FluentTerminal)

如果要用oh-my-zsh，可以先去下载[Powerline字体](https://github.com/powerline/fonts)

## 第三步 - 准备ruby

打开你的终端（开始菜单里的Ubuntu或者Fluent Terminal），跟着提示设置默认用户和密码

```bash
> sudo python oh-my-tuna.py --global # 用py修改apt镜像源为清华tuna源
> sudo apt update # 刷新
> sudo apt upgrade # 升级现有的包

# rvm
> gpg --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB
> \curl -sSL https://get.rvm.io | bash -s stable
> echo "ruby_url=https://cache.ruby-china.com/pub/ruby" > /usr/local/rvm/user/db
> source ~/.bashrc
> source ~/.bash_profile
> rvm install ruby
> gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/ # 修改gem镜像源为ruby-china源
> bundle config mirror.https://rubygems.org https://gems.ruby-china.com
> gem install rails
```

## 第四步 - 准备nodejs&yarn

现在是前端的时代，rails也内置了webpacker，可以快速利用nodejs进行开发

Ubuntu源的nodejs和yarn都比较旧，我们需要安装新版

```bash
# Nodejs
> curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
> sudo apt install nodejs

# yarn
> curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
> echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
> sudo apt update && sudo apt install yarn

# 淘宝镜像
> npm config set registry https://registry.npm.taobao.org
> yarn config set registry https://registry.npm.taobao.org

# node-sass镜像
> npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
> yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
```

至此，基本的配置就结束了！接下来就可以打开VSCode，利用remote扩展进行rails开发了。
