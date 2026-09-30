---
date: "2024-08-02"
tags:
  - Linux
  - ArchLinux
---

# 从零开始的Archlinux安装与配置

## 双系统

官方推荐先安装Windows, 安装Arch时和Windows共用EFI

## 安装

```bash
systemctl stop reflector.service
ls /sys/firmware/efi/efivars
dhcpcd
ping baidu.com
timedatectl set-ntp true
nano /etc/pacman.d/mirrorlist
```

```conf
Server = https://mirrors.ustc.edu.cn/archlinux/repo/os/arch
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/repo/os/arch
```

```bash
lsblk
cfdisk /dev/sdb
```

| 硬盘路径 | 分区      | 用途/格式        | 挂载路径  |
| :------- | --------- | ---------------- | --------- |
| /dev/sda | /dev/sda1 | EFI引导          | /mnt/boot |
|          | /dev/sda2 | Windows保留分区  |           |
|          | /dev/sda3 | Windows主分区    |           |
|          | /dev/sda4 | Windows恢复分区  |           |
| /dev/sdb | /dev/sdb1 | Linux FileSystem | /mnt      |
|          | /dev/sdb2 | Swap             | swap      |

```bash
fdisk -l
mkswap /dev/sdb2
mkfs.btrfs -L Arch /dev/sdb1
mount -t btrfs -o compress=zstd /dev/sdb1 /mnt
df -h
btrfs subvolume create /mnt/@
btrfs subvolume create /mnt/@home
btrfs subvolume list -p /mnt
umount /mnt

mount -t btrfs -o subvol=/@,compress=zstd /dev/sdb1 /mnt
mkdir /mnt/home
mount -t btrfs -o subvol=/@home,compress=zstd /dev/sdb1 /mnt/home
mkdir -p /mnt/boot
mount /dev/sda1 /mnt/boot
swapon /dev/sdb2
pacstrap /mnt base base-devel linux linux-firmware btrfs-progs nano networkmanager vim sudo zsh dhcpcd git linux-headers dialog wget curl
genfstab -U /mnt > /mnt/etc/fstab
cat /mnt/etc/fstab
arch-chroot /mnt
nano /etc/hostname
nano /etc/hosts
```

```hosts
127.0.0.1   localhost
::1         localhost
127.0.1.1   hobr
```

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
hwclock --systohc
nano /etc/locale.gen
locale-gen
echo 'LANG=en_US.UTF-8' > /etc/locale.conf
passwd root
mkinitcpio -P
pacman -S intel-ucode grub efibootmgr os-prober dosfstools
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=ARCH
nano /etc/default/grub
```

```grub
~抄的~
- 去掉`quiet`
- `loglevel=3 nowatchdog`
- `GRUB_DISABLE_OS_PROBER=false`
```

```bash
grub-mkconfig -o /boot/grub/grub.cfg
exit
umount -R /mnt
reboot
```

## 配置

### 系统

```bash
systemctl enable --now NetworkManager dhcpcd
nmcli dev wifi list
nmcli dev wifi connect "名称" password "密码"
ping www.bilibili.com
sudo grub-mkconfig -o /boot/grub/grub.cfg
useradd -m -G wheel -s /bin/bash hobr
passwd hobr
EDITOR=nano visudo
```

```diff
# 去除 %wheel ALL=(ALL:ALL) ALL 前面的 #
# 在下一行插入 Defaults:hobr !authenticate
```

### 环境

```bash
sudo pacman -Syyu
sudo pacman -S python ruby python-pip rustup
sudo nano /etc/pacman.conf
```

```conf
[archlinuxcn]
Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
```

```bash
sudo pacman -S archlinux-keyring archlinuxcn-keyring
sudo pacman -Syyu
sudo pacman -S paru asp bat v2ray proxychains axel
paru -Syyu
```

### 驱动

```bash
paru -S nvidia-open-dkms nvidia-settings lib32-nvidia-utils intel-undervolt bbswitch tlp tlp-rdw
sudo systemctl enable tlp.service
sudo systemctl enable NetworkManager-dispatcher.service
sudo systemctl mask systemd-rfkill.service
sudo systemctl mask systemd-rfkill.socket
sudo tlp start
lspci | grep NVIDIA
```

### Hyprland

```bash
paru -S ttf-arphic-ukai ttf-arphic-uming ttf-dejavu ttf-liberation adobe-source-han-serif-cn-fonts ttf-ubuntu-nerd
noto-fonts-emoji noto-fonts-extra noto-fonts-sc powerline-fonts noto-fonts noto-fonts-cjk wqy-zenhei ttf-ubuntu-mono-nerd
adobe-source-han-sans-cn-fonts wqy-bitmapfont wqy-zenhei ttf-sarasa-gothic wqy-microhei wqy-microhei-lite ttf-sourcecodepro-nerd
adobe-source-code-pro-fonts adobe-source-sans-pro-fonts adobe-source-serif-pro-fonts adobe-source-han-sans-otc-fonts
ttf-hannom opendesktop-fonts ttf-arphic-uming ttf-arphic-ukai otf-droid-nerd ttf-dejavu-nerd ttf-firacode-nerd ttf-hack-nerd
ttf-inconsolata-nerd ttf-jetbrains-mono-nerd ttf-meslo-nerd ttf-monoid-nerd ttf-mononoki-nerd ttf-nerd-fonts-symbols ttf-noto-nerd

mkdir ~/.config/fontconfig
cd ~/.config/fontconfig
axel https://raw.githubusercontent.com/szclsya/dotfiles/master/fontconfig/fonts.conf

proxychains paru -S pipewire pipewire-alsa pipewire-audio pipewire-jack
pipewire-pulse gst-plugin-pipewire wireplumber networkmanager
network-manager-applet bluez bluez-utils blueman sddm-git
qt5-wayland qt6-wayland libva nvidia-vaapi-driver-git
qt5-quickcontrols qt5-quickcontrols2 qt5-graphicaleffects
qt5 qt6 hyprland-nvidia dunst rofi-lbonn-wayland-git
waybar-hyprland-git swww swaylock-effects wlogout libdisplay-info-git
grim slurp swappy cliphist polkit-kde-agent ark
xdg-desktop-portal-hyprland xdg-desktop-portal-gtk
imagemagick qt5-imageformats pavucontrol pamixer xdg-utils
nwg-look-bin kvantum qt5ct qt6ct kitty neofetch dolphin
zsh exa brightnessctl gamemode mangohud xorg-xwayland glfw-wayland
xorg-xlsclients meson wl-clipboard udiskie gtk4 gnome-keyring
```

```bash
sudo nano /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT= xxxxxxx splash nvidia_drm.modeset=1

sudo grub-mkconfig -o /boot/grub/grub.cfg
sudo naoo /etc/mkinitcpio.conf
MODULES xxxxxx nvidia nvidia_modeset nvidia_uvm nvidia_drm

sudo mkinitcpio --config /etc/mkinitcpio.conf

sudo nano /etc/modprobe.d/nvidia.conf
options nvidia-drm modeset=1
```

```bash
git clone https://ghproxy.com/https://github.com/Hobr/hyprdots
cd hyprdots/Scripts
./restore_fnt.sh
./restore_cfg.sh
sudo mkdir -p /etc/sddm.conf.d
sudo touch /etc/sddm.conf.d/kde_settings.conf
sudo cp /etc/sddm.conf.d/kde_settings.conf /etc/sddm.conf.d/kde_settings.t2.bkp
sudo cp /usr/share/sddm/themes/corners/kde_settings.conf /etc/sddm.conf.d/
sudo nano /etc/default/grub
GRUB_DEFAULT=saved
GRUB_GFXMODE=1920x1080x32,auto
GRUB_THEME=\"/usr/share/grub/themes/pochita/theme.txt
GRUB_SAVEDEFAULT=true

sudo grub-mkconfig -o /boot/grub/grub.cfg
xdg-mime default org.kde.dolphin.desktop inode/directory
hyprctl reload
sudo usermod -a -G seat hobr
sudo systemctl enable NetworkManager bluetooth sddm seatd
reboot
```

### 软件

```bash
cd ~/.config
nano chrome-flags.conf
--ozone-platform-hint=wayland
--force-dark-mode
--enable-features=WebUIDarkMode
--ignore-gpu-blocklist
--enable-gpu-rasterization
--enable-zero-copy
--gtk-version=4

nano electron-flags.conf
--enable-features=WaylandWindowDecorations
--ozone-platform-hint=auto

sudo nano /etc/sddm.conf
[General]
Numlock=on

paru -S neofetch screenfetch ntfs-3g timeshift lolcat pacman-contrib
unarchiver wget bat tree htop screen haveged which zip unzip nano neovim
python-pip python-pynvim grub-btrfs telegram-desktop
libreoffice-still libreoffice-still-zh-cn yesplaymusic vlc mpv v2ray v2raya
asp bat obsidian zotero-beta texlive gtkwave blender postman electron texstudio

# AUR
paru -S yesplaymusic google-chrome visual-studio-code-bin mkinitcpio-firmware
sudo systemctl enable haveged
sudo systemctl start haveged
```

### 输入法

````bash
paru -S fcitx5 fcitx5-qt fcitx5-gtk fcitx5-configtool fcitx5-rime fcitx5-pinyin-moegirl-rime fcitx5-config-qt
git clone --depth=1 https://github.com/Mark24Code/rime-auto-deploy.git --branch latest
cd rime-auto-deploy
./installer.rb
cp /usr/share/rime-data/moegirl.dict.yaml ~/.local/share/fcitx5/rime/moegirl.dict.yaml
nano ~/.local/share/fcitx5/rime/rime_ice.dict.yaml

import_tables:
  ...
  ...
  - moegirl

nano `/etc/environment`

```bash
GTK_IM_MODULE=fcitx5
QT_IM_MODULE=fcitx5
SDL_IM_MODULE=fcitx5
XMODIFIERS=@im=fcitx5
````

### 开发者

```bash
paru -S qt6 nvm python python-pip python-setuptools ruby docker php gcc clang cmake make automake git gdb qtcreator gtkwave llvm docker-compose rustup anaconda cuda cudnn mold
echo 'export RUSTUP_UPDATE_ROOT=https://mirrors.tuna.tsinghua.edu.cn/rustup/rustup' >> ~/.bash_profile
echo 'export RUSTUP_DIST_SERVER=https://mirrors.tuna.tsinghua.edu.cn/rustup' >> ~/.bash_profile
rustup default stable
rustup component add rust-analyzer rustfmt
npm config set registry https://registry.npmmirror.com
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
gem sources --add https://mirrors.aliyun.com/rubygems/ --remove https://rubygems.org/
gem install bundle
bundle config mirror.https://rubygems.org https://mirrors.aliyun.com/rubygems/

nano ~/.cargo/config
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"

git config --global user.name "Hobr"
git config --global user.email "mail@hobr.site"
ssh-keygen -t rsa -C "mail@hobr.site"
gpg --full-gen-key
gpg --fingerprint -K --keyid-format long
git config --global user.signingkey 0FD726E34F50F5B0
git config --global commit.gpgsign true
gpg --armor --export 0FD726E34F50F5B0
cat ~/.ssh/id_rsa.pub
conda config --set show_channel_urls yes
nano ~/.condarc

channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch-lts: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  deepmodeling: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/

conda clean -i
cpan
nano ~/.cpan/CPAN/MyConfig.pm
'urllist' => [q[http://mirrors.ustc.edu.cn/CPAN/]],

sudo nano /etc/docker/daemon.json
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn/"]
}
```

### Windows字体

```bash
sudo mkdir /usr/share/fonts/WindowsFonts
cd /path/to/C:/Windows/Fonts
sudo cp ./* /usr/share/fonts/WindowsFonts
sudo chmod 755 /usr/share/fonts/WindowsFonts/*
fc-cache -vf
```

### zsh

```bash
paru -Soh-my-zsh-git zsh-theme-powerlevel10k zsh-syntax-highlighting zsh-autosuggestions autojump
chsh -l
chsh -s /usr/bin/zsh
reboot
p10k configure
```

### 休眠

```bash
lsblk -o name,mountpoint,size,uuid
## 获取swap的UUID
sudo nano /etc/default/grub
# grub
resume=UUID=13ec7b86-eb9c-45a9-ae50-9606279b506a

sudo grub-mkconfig -o /boot/grub/grub.cfg
sudo nano /etc/mkinitcpio.conf
# conf
在 HOOKS行 udev后添加 resume

sudo mkinitcpio -P
reboot
```

## 恢复系统

Ctrl+Alt+F2-F6进入tty

```bash
sudo timeshift --list
sudo timeshift --restore --snapshot '20XX-XX-XX_XX-XX-XX' --skip-grub
```

## GPG密钥迁移

```bash
gpg --fingerprint -K --keyid-format long
gpg --export-secret-keys -a <keyid> > secret-full-key.asc
gpg --export -a <keyid> > public-key.asc
# 新系统
gpg --import public-key.asc
gpg --import secret-full-key.asc
git config --global user.signingkey <keyid>
git config --global commit.gpgsign true
```
