---
title: nginx优化
date: 2018-01-21 17:03:35
tags:
---
## main

**worker_processes**

进程数设置，通常和worker_cpu_affinity搭配使用。

比如一个4核机器，设置为
```config
worker_processes    4;
worker_cpu_affinity 0001 0010 0100 1000;
```
代表开4个进程，分别绑定CPU0-CPU3。

worker_processes取值可以为auto，会自动设置为cpu个数。
worker_cpu_affinity取值也可以为auto，会自动分别绑定可用的cpu。也可以auto 01010101，表示分别绑定CPU1、CPU3、CPU5、CPU7。
