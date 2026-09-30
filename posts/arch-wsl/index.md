---
date: "2023-04-10"
tags:
  - Linux
  - ArchLinux
  - WSL
---

# Archlinux WSL配置

## 为什么

Archlinux大法好，不用多说了吧？2023年了还有人不用arch？

## 系统要求

- CPU支持且开启虚拟化
- 系统版本新一点
- 配置好点

## 简单配置

### 安装WSL

以管理员身份打开Powershell并执行

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

## 重启电脑后执行
wsl --set-default-version 2
```

### 安装ArchWSL

下载[yuk7/ArchWSL](https://github.com/yuk7/ArchWSL/releases)并解压到单独的地方，运行**Arch.exe**

安装结束后，再次打开，进行初始化

### 系统初始化

ArchWSL安装后还需要调不少的东西，首先打开Arch.exe

```bash
# 设置root密码
passwd
useradd -m -g users -G wheel -s /bin/bash hobr
passwd hobr
```

打开Powershell并进入Arch.exe所在路径

```powershell
# 修改默认用户
.\Arch.exe config --default-user hobr
.\Arch.exe config --append-path false
.\Arch.exe config --default-term wt
.\Arch.exe config --mount-drive true
```

### 更换镜像源

```bash
# 更换镜像
sudo rm /etc/pacman.d/mirrorlist
sudo cat >> /etc/pacman.d/mirrorlist <<EOF
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/\$repo/os/\$arch
Server = https://mirrors.ustc.edu.cn/archlinux/\$repo/os/\$arch
EOF

sudo cat >> /etc/pacman.conf <<EOF
[archlinuxcn]
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/\$arch
Server = https://mirrors.ustc.edu.cn/archlinuxcn/\$arch
EOF
sudo pacman -Syy

# pacman初始化
sudo pacman-key --init
sudo pacman-key --populate
sudo pacman -Sy archlinux-keyring archlinuxcn-keyring
sudo pacman-key --populate archlinuxcn archlinux
sudo pacman -Syyu
```

### 安装、配置软件

```bash
sudo pacman -S yay
yay --aururl "https://mirrors.ustc.edu.cn/archlinuxcn" --save

yay -S linux-firmware base base-devel dialog intel-ucode

yay -S wget bat tree htop autojump screen screenfetch neofetch haveged which zip unzip
sudo systemctl start haveged
sudo systemctl enable haveged

yay -S nano neovim zsh python-pynvim
git clone https://mirrors.tuna.tsinghua.edu.cn/git/ohmyzsh.git
cd ohmyzsh/tools
REMOTE=https://mirrors.tuna.tsinghua.edu.cn/git/ohmyzsh.git sh install.sh
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
nano ~/.zshrc
## ZSH_THEME="powerlevel10k/powerlevel10k"
## plugins=( zsh-autosuggestions zsh-syntax-highlighting)
## 在source "$ZSH/oh-my-zsh.sh"前添加 fpath+=${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}/plugins/zsh-completions/src

yay -S wqy-microhei wqy-microhei-lite wqy-bitmapfont wqy-zenhei ttf-arphic-ukai ttf-arphic-uming adobe-source-han-sans-cn-fonts adobe-source-han-serif-cn-fonts noto-fonts-cjk ttf-dejavu ttf-liberation powerline-fonts

sudo pacman -S qt6
yay -S nodejs npm python python-pip python-setuptools tk jdk ruby docker php gcc clang cmake make automake git gdb qtcreator gtkwave rust llvm docker-compose
npm config set registry https://registry.npm.taobao.org/
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/
gem install bundle
bundle config mirror.https://rubygems.org https://gems.ruby-china.com

git config --global user.name "Hobr"
git config --global user.email "mail@hobr.site"
ssh-keygen -t rsa -C "mail@hobr.site"
gpg --full-gen-key
gpg --fingerprint -K --keyid-format long
git config --global user.signingkey 0FD726E34F50F5B0
git config --global commit.gpgsign true
gpg --armor --export 0FD726E34F50F5B0
cat ~/.ssh/id_rsa.pub
```

### 用户权限

```bash
visudo
# 去除 %wheel ALL=(ALL:ALL) ALL 前面的 #
# 在下一行插入 Defaults:hobr !authenticate
```

### 语言切换

```bash
sudo nano /etc/locale.gen
# 删除 zh_CN.UTF-8 UTF-8前的#
sudo locale-gen
sudo echo ‘LANG=zh_CN.UTF-8’ > /etc/locale.conf
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

### ldconfig: /usr/lib/wsl/lib/libcuda.so.1 is not a symbolic link

```bash
cd /usr/lib/wsl/lib
sudo rm libcuda.so libcuda.so.1
sudo ln -s libcuda.so.1.1 libcuda.so.1
sudo ln -s libcuda.so.1 libcuda.so
sudo ldconfig
sudo echo "ldconfig = false" >> /etc/wsl.conf
```
