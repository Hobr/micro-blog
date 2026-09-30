---
date: "2018-08-11"
tags:
  - Android
  - NDK
---

# NDK与iconv

最近和团队在开发[SA-MP Mobile](https://github.com/SA-MP-Mobile/SA-MP-Mobile)，为了能够在imgui绘制的Window中使中文显示地不乱码，花了好几天，奈何不断撞坑`use of undeclared identifier 'iconv'`，下面总结一下自己发现的原因（可能有三种）。

## 没有引入iconv.h

这点应该不会出错

## Android.mk里未声明引入静态库

其实很好解决，只需在Android.mk中增加

```makefile
LOCAL_WHOLE_STATIC_LIBRARIES += android_support # 放于编译选项前

$(call import-module, android/support) # 放于最后一段
```

## NDK版本问题

### 当NDK版本大于等于r15c且小于r17b

其实本人遭遇到的最麻烦的就是这个问题。我在Google和Baidu上搜索了大量资料都没有解决，最后我在[NDK的Github](https://github.com/android-ndk/ndk)上发现了[这样一个Issue](https://github.com/android-ndk/ndk/issues/702)，本人使用过的NDK r15c、r17b均无法编译，原来是libc链接有问题，而这一问题在[r17b中得到修复](https://github.com/android-ndk/ndk/wiki/Changelog-r17)，虽然依旧无用（详见下文）。

### 当NDK版本大于或大于r17b

其实很多人都会在第一时间打开出错的iconv的头文件，然后发现以下代码：

```cpp
#if __ANDROID_API__ >= 28
iconv_t iconv_open(const char* __src_encoding, const char* __dst_encoding) __INTRODUCED_IN(28);
size_t iconv(iconv_t __converter, char** __src_buf, size_t* __src_bytes_left, char** __dst_buf, size_t* __dst_bytes_left) __INTRODUCED_IN(28);
int iconv_close(iconv_t __converter) __INTRODUCED_IN(28);
#endif /* __ANDROID_API__ >= 28 */
```

各位都可以看出来，他要求我们的SDK API >= 28，而>=28是什么概念呢？根据[Google Android Guide](https://developer.android.com/guide/topics/manifest/uses-sdk-element#ApiLevels)里的说明来讲，28是Android P(9)，我们根本做不到要求用户升级系统到Android 9，很无奈，乖乖地换r15c以下的版本吧

## 总结

> 谷歌，我***
