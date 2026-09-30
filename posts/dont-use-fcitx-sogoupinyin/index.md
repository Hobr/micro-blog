---
date: "2020-02-01"
tags:
  - Linux
  - ArchLinux
---

# 不要用“fcitx-sogoupinyin”

自从换了Archlinux后，我感觉整个人都清bao爽gan了！各种应用都好用，除了“fcitx-sogoupinyin”

## What's your problem

每次开机，这个laji都会提示

搜狗输入法异常！请删除.config/SogouPY 并重启

What's your problem?

```bash
sogou-qimpanelsogou-qimpanel: error while loading shared libraries: libfcitx-qt.so.0: cannot open shared object file: No such file or directory
```

## 解决方案

我试着去谷歌了一下，得到了这样一个解决方案：

```bash
sudo pacman -S fcitx-qt4
```

> **QT4？？？9102年了，搜狗的最新版用QT4？？？**

好吧我输了，但当我敲下回车后，pacman提示

`fcitx-lilydjwg-git 与 fcitx 有冲突。删除 fcitx 吗？[y/N]`

？？？

好吧，搜狗你可以滚出的我的电脑了

所以，最好的解决方案是——用“fcitx-googlepinyin”

```bash
sudo pacman -S fcitx-googlepinyin
```

## 总结

国产软件们，What's your problems?
