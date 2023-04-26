---
title: 浅谈一下kubernetes
date: 2023-04-26 14:28:15
tags:
description: 现在Kubernetes已经没有了实际意义上的竞争对手，它的地位就如同Linux一样，成为了事实上的云原生操作系统，是构建现代应用的基石。还不快了解一下。
---

在谈kubernetes之前，先看看一切的基础：容器。

## 容器

容器是什么？[谷歌](https://cloud.google.com/learn/what-are-containers?hl=zh-cn)、[IBM](https://www.ibm.com/cn-zh/topics/containers)、[AWS](https://aws.amazon.com/cn/what-is/containerization/)、[华为](https://www.huaweicloud.com/zhishi/edu-arc-jsyfw38.html)、[微软](https://learn.microsoft.com/zh-cn/dotnet/architecture/microservices/container-docker-introduction/)对容器都有各自的解释。

容器可以分上下两个维度来定义：
- 从底下看，容器是一种内核**轻量级**的[操作系统层虚拟化技术](https://zh.wikipedia.org/wiki/%E4%BD%9C%E6%A5%AD%E7%B3%BB%E7%B5%B1%E5%B1%A4%E8%99%9B%E6%93%AC%E5%8C%96)。用于在单个操作系统实例中运行多个隔离的用户空间。
- 从上面看，容器是在应用程序层面上的一个抽象，它将应用程序及其依赖项打包在一起，以便可以在不同的计算环境中快速而一致地运行。

### vs虚拟机

虽然都是虚拟化技术，但它和虚拟机是完全不同的。从[Docker官网](https://www.docker.com/resources/what-container/)借一张对比图。
{% asset_img container_vs_vm.png 容器vs比虚拟机 %}

- 容器是应用程序层的抽象，容器之间共享操作系统内核，每个容器作为隔离的进程在用户空间中运行。容器占用的空间比虚拟机少，可以处理更多的应用程序。
- 虚拟机是物理硬件的抽象，将一台服务器变成多台服务器。每个虚拟机都包括完整的操作系统和应用程序，需要更多资源。

**运行效率**，是容器相比虚拟机最大的优势。

### 本质

虚拟机使用的是[Hypervisor](https://en.wikipedia.org/wiki/Hypervisor)技术，那容器是怎么实现如此高效轻便的隔离特性呢？

其奥秘就在Linux操作系统内核中，为资源隔离提供了三种技术：[namespace](https://en.wikipedia.org/wiki/Linux_namespaces)、[cgroups](https://zh.wikipedia.org/wiki/Cgroups)、[chroot](https://zh.wikipedia.org/wiki/Chroot)。虽然这三种技术的初衷并不是为了容器，但是它们结合在一起却发生了奇妙的反应。
- namespace 
可以创建出独立的文件系统、主机名、进程号，还有网络等资源空间。
- cgroup 
用来实现对进程的CPU、内存等资源的优先级和配额限制。
- chroot 
可以更改进程的根目录，也就是限制进程访问原有的文件系统。

综合这三种技术，具有完善的隔离特性的容器就此出现了。早期的容器有[Solaris Containers](https://en.wikipedia.org/wiki/Solaris_Containers)、[OpenVz](https://wiki.openvz.org/Main_Page)、[Linux Container(LXC)](https://linuxcontainers.org/lxc/introduction/)，但直到Docker的出现，才让容器技术真正大众化起来。可以看一下10年前[Solomon Hykes](https://github.com/shykes)在[PyCon 2013大会](https://us.pycon.org/2013/schedule/)上的Lightning talks：[The future of Linux Containers](https://www.youtube.com/watch?v=wW9CAH9nSLs)，首次向全世界展示了Docker技术。顺便，[Aqua Blog](https://blog.aquasec.com/)上有一篇[容器发展简史](https://blog.aquasec.com/a-brief-history-of-containers-from-1970s-chroot-to-docker-2016)值得一看。

### 容器编排（Container Orchestration）

Docker出现后，容器被越来越多人使用。但到生产环境应用部署的时候，却显得`步履维艰`。因为容器只是针对单个进程的隔离和封装，而实际的应用场景却是要求许多的应用进程互相协同工作，其中的各种关系和需求非常复杂，在容器这个技术层次很难掌控。

于是在Docker周边涌现出的数不胜数的扩展、增强产品中，出现了一个叫[Fig](https://orchardup.github.io/fig.sh/index.html)的小项目。Fig为Docker引入了[容器编排](https://www.vmware.com/topics/glossary/content/container-orchestration.html)的概念，使用[YAML](https://yaml.org/)来定义容器的启动参数、先后顺序和依赖关系，让用户不再有Docker冗长命令行的烦恼，并第一次见识到了`声明式`的威力。Docker公司也很快意识到了Fig这个小工具的价值，于是就在2014年7月把它买了下来，集成进Docker内部，改名成了[docker compose](https://docs.docker.com/compose/)。

### 云原生时代
容器技术开启了云原生的大潮，面对服务器集群，只能编排单机的docker compose已经力不从心。于是在2014年，Docker公司推出了Docker Swarm（现已更名为[Docker "Classic" Swarm](https://github.com/docker-archive/classicswarm)）来支持集群。

然后在2015年，谷歌

## Kubernetes

Kubernetes的**Master/Node架构**是它具有自动化运维能力的关键，它长这样。
{% asset_img kubernetes-control-plane.png Master/Node架构 %}
