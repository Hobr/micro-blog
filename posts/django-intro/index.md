---
date: "2020-04-04"
tags:
  - Python
  - Django
---

# Django简易入门

不会吧不会吧，难道真的还有人不知道Django？？？接下来让我们康康

## 准备

### Python安装

建议下载最新版，本教程使用的开发环境中Python为官方最新版本。

过于简单，不多磨叽。

### pip安装

Windows的Python安装包自带pip，大多数Linux发行版亦可直接安装。

部分人可尝试下载get-pip.py

```bash
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
```

如果安装时提示权限不足，请在前面加sudo

### Django安装

最简单的方法如下

```bash
pip install Django
python -m django --version
```

## Hello World

在大多数语言教程中，作者会选择输出Hello World来开启Code的第一步，那么我们也先从"Hello World!"开始

### 创建项目

在网站开始前，我们需要创建项目，里面会包括许多东西

在bash环境下选择到你预定的项目存放目录，然后输入以下指令

```bash
django-admin startproject projectname
```

其中的"projectname"可以自行修改为自己想要的项目名称，名称请避免与其他Python包/Django组件冲突

此时的projectname目录的结构如下

- projectname/
- manage.py
- projectname/
- **init**.py
- settings.py
- wsgi.py

其中，最外层的projectname目录的命名无关紧要

- manage.py：一个命令行工具，可以使你用多种方式对Django项目进行交互
- 内层的projectname/目录是你的项目的真正的Python包。它是你导入任何东西时将需要使用的Python包的名字
- projectname/**init**.py：一个空文件，它告诉Python这个目录应该被看做一个Python包。
- projectname/settings.py：该Django 项目的设置/配置
- projectname/urls.py：该Django项目的URL声明；你的Django站点的“目录”
- projectname/wsgi.py：用于你的项目的与WSGI兼容的Web服务器入口

### 启动开发服务器

Django默认自带一个开发服务器，可以供开发者快速测试，请先跳转到manage.py所在目录然后输入以下指令

```bash
python manage.py runserver
```

接着，你应该看到了屏幕上输出的提示，此时你就可以访问127.0.0.1:8000了！

### 创建应用

有的人应该发现，现在没有model没有view，那么我们怎样才能开始网站的开发呢？

项目和应用的区别:一个应用程序是一个Web应用程序，它执行一些操作，例如Weblog系统，公共记录数据库或简单的应用程序。 项目是特定网站的配置和应用程序的集合。 项目可以包含多个应用程序。 一个应用程序可以在多个项目中。

首先请跳转到manage.py所在的目录，然后输入以下指令

```bash
python manage.py startapp appname
```

此时，我们的第一个应用appname就创建好了！appname可以自取

## 编写视图

请先打开你的应用里的views.py（项目名称/应用名称/views.py）

首先我们要导入HttpResponse

```python
from django.http import HttpResponse
```

接着写一个函数

```python
def index(request):
    return HttpResponse("Hello world")
```

此时，我们的views.py文件内容应该是这样的

```python
from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello world")
```

这样我们的视图就写好了

这时，我们启动开发服务器

```bash
python manage.py runserver
```

会发现：- -?我写的视图哪去了

其实，熟悉PHP等语言框架的人知道，我们此时应该写路由，在Django中，我们使用URLconf

## URLconf

我们目前的既定计划是：打开127.0.0.1:8000时输出"Hello World"

请打开projectname/projectname/urls.py

首先我们要导入我们的视图

```python
from appname import views
```

接着修改urlpatterns，增加一行代码

```python
path('', views.index,name = 'index'),
```

此时，你的urls.py应该是这样的

```python
from django.contrib import admin
from django.urls import path
from appname import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name = 'index'),
]
```

这样，我们就可以再次启动开发服务器了！

```bash
python manage.py runserver
```

打开127.0.0.1:8000就可以看到"Hello World"的字样！

### path函数

path()函数传入四个参数，route和view是必须的，kwargs和name是可选的。

### route

route是一个包含URL模式的字符串。处理请求时，Django从urlpatterns中的第一个模式开始，并在列表中向下，比较请求的URL和每个模式，直到找到匹配的模式

### view

当Django找到匹配的模式时，它会以HttpRequest对象作为第一个参数和路由中的任何“捕获”值作为关键字参数来调用指定的视图函数

### kwargs

任意关键字参数可以在字典中传递给目标视图

### name

命名您的URL可以让您从Django的其他地方明确地引用它，特别是在模板中。这个强大的功能使您可以对项目的URL模式进行全局更改，而只触摸单个文件

## 数据库配置

首先请打开projectname/projectname/settings.py

默认情况下，Django为你提供了sqlite3，如果你不擅长其他数据库并且只是想学习一下Django，可以直接跳过这一步

但有的人则不同，我们学习它就是为了在生产环境中使用，所以我们要选择一些更具可伸缩性的数据库例如PostgreSQL、MySQL，在这里我们以MySQL为主

打开settings.py后，找到DATABASES，修改为以下内容

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'dbname',
        'HOST': 'localhost',
        'USER': 'root',
        'PASSWORD': 'password',
        'PORT': '3306',
    }
}
```

请根据你对数据库的配置修改相应的参数

同时，找到TIME\_ZONE并设置为我们的时区

```python
TIME_ZONE = 'Asia/Shanghai'
```

注意，是**Shanghai**，不是**Beijing**

接着，运行该指令

```bash
python manage.py migrate
```

Django自带的一些应用也使用到了数据库，你需要运行该函数创建数据表

```python
django.core.exceptions.ImproperlyConfigured: Error loading MySQLdb module.
```

这时，使用MySQL的人会发现出现了问题！提示我们没有安装MySQLdb，有的人会立刻“pip install MySQLdb”，然后发现又出现了问题！

不要继续折腾了，MySQLdb模块不支持python3，所以我们应该使用pymysql

```bash
pip install pymysql
```

然后打开projectname/projectname/**init**.py，添加以下代码

```python
import pymysql
pymysql.install_as_MySQLdb()
```

接着，我们再次执行migrate命令，如果数据库配置没有问题的话，它就会自动开始数据表创建了

## 创建模型

数据库配置好后，我们就要开始编写模型了！

打开projectname/appname/models.py

首先我们试着创建一个简单的模型，在原有代码里加入以下内容

```python
class User(models.Model):
    UserID = models.IntegerField(default = 0)
    UserName = models.CharField(max_length = 100)
    UserPass = models.CharField(max_length = 300)
```

## 激活模型

首先我们要告诉Django这个应用的存在，再次打开projectname/projectname/settings.py并找到"INSTALLED\_APPS"

因为AppnameConfig类位于projectname/appname/apps.py中，所以我们要这样写

```python
'appname.apps.AppnameConfig',
```

实际内容请带入你的应用名称，并将这段代码加入到INSTALLED\_APPS

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'appname.apps.AppnameConfig',
]
```

现在，我们还需要运行一个命令

```bash
python manage.py makemigrations
```

这样Django就知道了你对数据库进行了一定的修改

现在，再次运行该命令

```bash
python manage.py migrate
```

你添加的模型就会被创建到数据库中了！

## 激活Django Admin

Django默认为你提供了一个管理系统，在里面你可以可视化地修改你创建的模型

### 创建一个管理账号

```bash
python manage.py createsuperuser
```

根据提示输入你的用户名、邮箱、密码

### 启动测试服务器来一览后台了！

```bash
python manage.py runserver
```

打开127.0.0.1:8000/admin/并输入用户名、密码

不过你会发现一个问题：我创建的模型呢？？？

我们在创建模型后，应该为其提供接口

### 注册模型

打开projectname/appname/admin.py 导入你的模型类并注册

```python
from django.contrib import admin
from .models import User
admin.site.register(User)
```

现在再次打开后台，就可以看到我们创建的模型了！
