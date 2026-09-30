---
date: "2021-02-17"
tags:
  - 安全
  - PGP
---

# PGP的十八般武艺

骚年，听说过PGP吗？没听说过？现在你听说过了吧！

## 这玩意它能干啥

PGP 全称是 Pretty Good Privacy，是一个被设计用来加密信息，保护隐私的软件。

- 加密和签名信息~~并放在网站上以显得很高端~~
- 增加联系你的安全途径
- 协助SSH验证（例如Github上的commit验证标识别)

![belike](belike.png)

事实上，此前有过不少关于伪造git commit的新闻，而有了PGP就可以有效防范被冒充了！

## 名词区分

- PGP （“Pretty Good Privacy”） 是最初商业软件的名字
- OpenPGP 是与最初 PGP 工具兼容的 IETF 标准
- GnuPG （“Gnu Privacy Guard”）是实现了 OpenPGP 标准的自由软件
- GnuPG 的命令行工具称为 “gpg”

## 下载

怎么样，是不是跃跃欲试了～

Linux发行版一般都带着，无需再次下载

```bash
1. # Mac OS
2. ❯ brew install gpg

4. # OpenBSD
5. ❯ pkg_add gnupg
```

## 生成

以下步骤无说明则选择默认的选择

```bash
1. ❯ gpg --full-gen-key

3. gpg (GnuPG) 2.2.27; Copyright (C) 2021 Free Software Foundation, Inc.
4. This is free software: you are free to change and redistribute it.
5. There is NO WARRANTY, to the extent permitted by law.

7. 请选择您要使用的密钥类型：
8. (1) RSA 和 RSA （默认）
9. (2) DSA 和 Elgamal
10. (3) DSA（仅用于签名）
11. (4) RSA（仅用于签名）
12. (14) Existing key from card
13. 您的选择是？

15. RSA 密钥的长度应在 1024 位与 4096 位之间。
16. 您想要使用的密钥长度？(3072)

18. 请求的密钥长度是 3072 位
19. 请设定这个密钥的有效期限。
20. 0 = 密钥永不过期
21. <n>  = 密钥在 n 天后过期
22. <n>w = 密钥在 n 周后过期
23. <n>m = 密钥在 n 月后过期
24. <n>y = 密钥在 n 年后过期
25. 密钥的有效期限是？(0)

27. 密钥永远不会过期
28. 这些内容正确吗？ (y/N)

30. GnuPG 需要构建用户标识以辨认您的密钥。
31. 真实姓名：
32. 电子邮件地址：
33. 注释：
```

输入你的信息

```bash
1. 您选定了此用户标识：
2. “hobrimttxx <hobrimttxx@gmail.com>”

4. 更改姓名（N）、注释（C）、电子邮件地址（E）或确定（O）/退出（Q）？
```

输入 o

```bash
1. ┌──────────────────────────────────────────────────────┐
2. │ Please enter the passphrase to                       │
3. │ protect your new key                                 │
4. │                                                      │
5. │ Passphrase: ________________________________________ │
6. │                                                      │
7. │       <OK>                              <Cancel>     │
8. └──────────────────────────────────────────────────────┘
```

输入密码

```bash
1. 我们需要生成大量的随机字节。在质数生成期间做些其他操作（敲打键盘
2. 、移动鼠标、读写硬盘之类的）将会是一个不错的主意；这会让随机数
3. 发生器有更好的机会获得足够的熵。
4. 我们需要生成大量的随机字节。在质数生成期间做些其他操作（敲打键盘
5. 、移动鼠标、读写硬盘之类的）将会是一个不错的主意；这会让随机数
6. 发生器有更好的机会获得足够的熵。
```

移动鼠标（**计算机随机数是伪随机数，所以这样可以多增加几个变量**）

```bash
1. gpg: 密钥 4832F7B86D737ECF 被标记为绝对信任
2. gpg: 吊销证书已被存储为‘/home/hobr/.gnupg/openpgp-revocs.d/82E930FF599B8D5493FABCED4832F7B86D737ECF.rev’
3. 公钥和私钥已经生成并被签名。

5. pub   rsa3072 2021-02-16 [SC]
6. 82E930FF599B8D5493FABCED4832F7B86D737ECF
7. uid                      hobrimttxx <hobrimttxx@gmail.com>
8. sub   rsa3072 2021-02-16 [E]
```

## 生成子密钥

为了安全，我们平时不要用主密钥，下面我们进入交互环境创建一个子密钥

```bash
1. ❯ gpg --edit-key hobrimttxx

3. gpg (GnuPG) 2.2.27; Copyright (C) 2021 Free Software Foundation, Inc.
4. This is free software: you are free to change and redistribute it.
5. There is NO WARRANTY, to the extent permitted by law.

7. 私钥可用。

9. gpg: 正在检查信任度数据库
10. gpg: marginals needed: 3  completes needed: 1  trust model: pgp
11. gpg: 深度：0  有效性：  1  已签名：  0  信任度：0-，0q，0n，0m，0f，1u
12. sec  rsa3072/4832F7B86D737ECF
13. 创建于：2021-02-16  有效至：永不       可用于：SC
14. 信任度：绝对        有效性：绝对
15. ssb  rsa3072/15A1A6026EAC6AEB
16. 创建于：2021-02-16  有效至：永不       可用于：E
17. [ 绝对 ] (1). hobrimttxx <hobrimttxx@gmail.com❯
```

输入'addkey'

```bash
1. gpg❯ addkey

3. 请选择您要使用的密钥类型：
4. (3) DSA（仅用于签名）
5. (4) RSA（仅用于签名）
6. (5) ElGamal（仅用于加密）
7. (6) RSA（仅用于加密）
8. (14) Existing key from card
9. 您的选择是？
```

选择4

```bash
1. RSA 密钥的长度应在 1024 位与 4096 位之间。
2. 您想要使用的密钥长度？(3072)
3. 请求的密钥长度是 3072 位
4. 请设定这个密钥的有效期限。
5. 0 = 密钥永不过期
6. <n>  = 密钥在 n 天后过期
7. <n>w = 密钥在 n 周后过期
8. <n>m = 密钥在 n 月后过期
9. <n>y = 密钥在 n 年后过期
10. 密钥的有效期限是？(0)
11. 密钥永远不会过期
12. 这些内容正确吗？ (y/N) y
13. 真的要创建吗？(y/N) y
14. 我们需要生成大量的随机字节。在质数生成期间做些其他操作（敲打键盘
15. 、移动鼠标、读写硬盘之类的）将会是一个不错的主意；这会让随机数
16. 发生器有更好的机会获得足够的熵。

18. sec  rsa3072/4832F7B86D737ECF
19. 创建于：2021-02-16  有效至：永不       可用于：SC
20. 信任度：绝对        有效性：绝对
21. ssb  rsa3072/15A1A6026EAC6AEB
22. 创建于：2021-02-16  有效至：永不       可用于：E
23. ssb  rsa3072/7CACBBAD460082F0
24. 创建于：2021-02-16  有效至：永不       可用于：S
25. [ 绝对 ] (1). hobrimttxx <hobrimttxx@gmail.com>
```

创建完成，保存！

```bash
1. gpg❯ save
```

## 创建撤销证书

假如你失去了主密钥的控制权，可以通过撤销证书来使你的证书失效，下面我们来试一试

```bash
1. ❯ gpg --gen-revoke -ao   revoke.pgp   hobrimttxx

3. sec  rsa3072/4832F7B86D737ECF 2021-02-16 hobrimttxx <hobrimttxx@gmail.com>

5. 要为这个密钥创建一个吊销证书吗？(y/N)

7. 请选择吊销的原因：
8. 0 = 未指定原因
9. 1 = 密钥已泄漏
10. 2 = 密钥被替换
11. 3 = 密钥不再使用
12. Q = 取消
13. （也许您会想要在这里选择 1）
14. 您的决定是什么？
```

选择3

```bash
1. 请输入描述（可选）；以空白行结束：

3. 吊销原因：密钥不再使用
4. （未给定描述）
5. 这样可以吗？ (y/N)

7. 已创建吊销证书。

9. 请把这个文件转移到一个您可以藏起来的介质上；如果坏人获取到了这
10. 份证书的话，那么他就能使用它并让您的密钥无法继续使用。把此证书
11. 打印出来再存放到安全的地方也是很好的方法，以免您的保存媒体变得
12. 不可读。但是千万小心：您机器上的打印系统可能会在打印过程中储存
13. 这些数据，并使得其他人看到！
```

## 签名和验证

```bash
1. # 方式一：生成二进制签名文件
2. ❯ gpg --sign input.txt

4. # 方式二：生成ASCII格式签名
5. ❯ gpg --clearsign input.txt

7. # 方式三：签名和原文件分开
8. ❯ gpg --armor --detach-sign input.txt

10. # 验证签名
11. ❯ gpg --verify demo.txt.asc demo.txt
```

## 加解密

### 加密

```bash
1. # recipient为接收者的公钥ID
2. ❯ gpg --recipient {keyid/uid} --output encrypt.txt --encrypt input.txt
```

### 解密

```bash
1. ❯ gpg --decrypt encrypt.txt --output decrypt.txt
```

## 列出密钥

```bash
1. ❯ gpg --fingerprint -K --keyid-format long
2. /home/hobr/.gnupg/pubring.kbx
3. -----------------------------
4. sec   rsa3072/xxxxxxxxxxxxxxxxx 2021-02-16 [SC]
5. 密钥指纹 = xxxxxxxxxxxxxxx
6. uid                 [ 绝对 ] TuoXin <hobrimttxx@gmail.com>
7. ssb   rsa3072/xxxxxxxxxxxx 2021-02-16 [E]
8. ssb   rsa3072/xxxxxxxxxxxx 2021-02-16 [S]
```

## 应用到Github

```bash
1. ❯ git config --global user.signingkey xxxxxxxxxxxx
2. ❯ git config --global commit.gpgsign true
```

然后导出我们的公钥

```bash
1. ❯ gpg --armor --export xxxxxxxxxxxx
2. -----BEGIN PGP PUBLIC KEY BLOCK-----
3. xxxxxxxxxxx
4. -----END PGP PUBLIC KEY BLOCK-----
```

把导出的这一片提交给Github!

## 总结

PGP还有许多神奇的功能，篇幅有限就不一一讲了。

怎么样，是不是感觉又学习到了一个神奇的东西？
