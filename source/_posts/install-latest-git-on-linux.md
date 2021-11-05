---
title: 在linux上安装最新版本的Git
date: 2017-04-19 20:45:00
tags: 
- git
- computer science
- linux
categories: 
- computer science
---
## CentOS

在CentOS上使用yum安装的git默认是1.7.1，使用git 1.7.1去clone一些repo时会出现下面的错误：
```bash
Initialized empty Git repository in /root/blog/.git/
error: The requested URL returned error: 400 Bad Request while accessing https://git.coding.net/xxx/xxx.git/info/refs

fatal: HTTP request failed
```
这是因为版本过低的缘故，git.coding.net要求使用1.8+版本的git。

升级git有两种方式，一种是下载源码编译，一种是使用第三方源。
本着懒人原则，我们使用第二种方法。

```bash
$ sudo yum install http://opensource.wandisco.com/centos/6/git/x86_64/wandisco-git-release-6-1.noarch.rpm
$ sudo yum update git
```

```bash
$ git --version
git version 2.11.1
```

搞定收工。

## Ubuntu

在ubuntu14.04上使用apt-get默认安装的版本是1.9.1，但很显然1.9不是最新版本，最新版本已经是2.+了。

和CentOS一样，使用第三方源来搞定。

首先添加PPA (Personal Package Archive)中的git-core源。
```bash
$ sudo add-apt-repository ppa:git-core/ppa
```

然后就可以顺利更新到最新版本的git。
```bash
$ sudo apt-get update
$ sudo apt-get install git
```

如果你使用的ubuntu很干净，有可能会提示add-apt-repository命令找不到。它是在software-properties-common包里的。对于一些版本的ubuntu，还需配合python-software-properties食用。
```bash
$ sudo apt-get install software-properties-common python-software-properties
```
