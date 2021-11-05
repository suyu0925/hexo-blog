---
title: 检查端口使用情况
date: 2019-05-15 11:41:50
description: 时常会碰到莫名的端口被占用，总结一下各平台下检查端口使用情况的方法。
tags:
- computer science
categories: 
- computer science
---

# 检查端口使用情况

## powershell on windows

```bash
Get-Process -Id (Get-NetTCPConnection -LocalPort YourPortNumberHere).OwningProcess
```

## lsof

首推的就是lsof命令。

```bash
$ lsof -i
$ lsof -i:8000
```

注意当前用户，如果想显示其它用户的使用情况，可使用
```bash
$ sudo lsof -i
```

## netstat

**Linux**
```bash
$ netstat -tulpn | grep LISTEN
```

**MacOS X**
```bash
$ netstat -anp tcp | grep LISTEN
$ netstat -anp udp | grep LISTEN
```

**Windows**
```bash
netstat -bano | more
netstat -bano | findstr LISTENING
netstat -bano | findstr /R /C:"[LISTEING]"
```

## nmap(需要安装)

```bash
$ sudo nmap -sT -O localhost
$ sudo nmap -sU -O 192.168.2.13 ##[ list open UDP ports ]##
$ sudo nmap -sT -O 192.168.2.13 ##[ list open TCP ports ]##
```

```bash
$ sudo nmap -sTU -O 192.168.2.13
```
