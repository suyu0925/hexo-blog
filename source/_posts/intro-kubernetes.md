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

然后在2015年，谷歌将换代的内部集群应用管理系统[Borg](https://kubernetes.io/blog/2015/04/borg-predecessor-to-kubernetes/)用Go语言改写并开源，命名为[Kubernetes](https://kubernetes.io/)。因为Kubernetes背后有着谷歌十多年生产环境经验的支持，理论水平也非常高，一经推出就引起了轰动。

同年，谷歌联合Linux基金会成立了[CNCF（Cloud Native Computing Foundation，云原生基金会）](https://www.cncf.io/)，[把Kubernetes捐献出来作为种子项目](https://techcrunch.com/2015/07/21/as-kubernetes-hits-1-0-google-donates-technology-to-newly-formed-cloud-native-computing-foundation-with-ibm-intel-twitter-and-others/?guccounter=1)。有了谷歌和Linux的保驾护航，再加上宽容开放的社区，作为CNCF的“头把交椅”，Kubernetes仅用了两年就打败了[Apache Mesos](https://mesos.apache.org/)和[Docker Swarm](https://docs.docker.com/engine/swarm/)，成为了云原生时代容器编排的唯一霸主和事实标准。

## Kubernetes

从某种角度上说，k8s（k8s代表k和s中间有8个字母，类似用i18n表示internationalization）可以说是一个集群级别的操作系统，主要功能就是资源管理和作业调度。

{% asset_img 云级操作系统 %}

操作系统的一个重要功能就是抽象，从繁琐的底层事务中抽象出一些简洁的概念，然后基于这些概念去管理系统资源。

Kubernetes也是这样，它的管理目标是大规模的集群和应用，必须要能够把系统抽象到足够高的层次，分解出一些松耦合的对象，才能简化系统模型，减轻用户的心智负担。

### 集群架构

{% asset_img cloud-operation-system.png k8s-cluster.webp 集群架构 %}

Kubernetes采用了现今流行的[**控制面/数据面**（Control Plane/Data Plane）架构](https://en.wikipedia.org/wiki/Control_plane)，集群里的计算机被称为**节点**（Node），少量的节点用作控制面来执行集群的管理维护工作，其他的大部分节点都被划归数据面，用来跑业务应用。

节点内部也具有复杂的结构，可分为核心的[组件](https://kubernetes.io/docs/concepts/overview/components/)和锦上添花的[插件](https://kubernetes.io/docs/concepts/cluster-administration/addons/)。

#### Master节点
Master里有4个组件，分别是apiserver、etcd、scheduler、controller-manager。
- API Server
apiserver是Master节点，同时也是整个k8s系统的唯一入口，它对外公开了一系列的RESTful API，并且加上了验证、授权等功能，所有其他组件只能和它直接通信，可以说是k8s里的联络员。
- Scheduler
- Controller Manager
- etcd

#### Node节点
- kubelet
定期向apiserver上报节点状态，apiserver再存到etcd里。
- kube-proxy
实现了TCP/UDP反向代理，让容器对外提供稳定的服务。
- Container Runtime
任何支持[CRI（Container Runtime Interface）](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)的容器运行时，比如[containerd](https://containerd.io/)，[CRI-O](https://cri-o.io/#what-is-cri-o)。

#### 插件

从可用到好用的实现路径之一就是插件。k8s设计非常灵活，使用k8s资源对象（如DaemonSet、Deployment等）来实现插件。

常用的有[Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard)和[DNS](https://kubernetes.io/docs/concepts/cluster-administration/addons/)。

### YAML

#### 声明式与命令式

- 命令式
交互性强，注重顺序和过程。但必须“告诉”计算机每步该做什么，所有的步骤都列清楚，这样程序才能够一步步走下去，最后完成任务，显得计算机有点“笨”。

- 声明式
不关心具体的过程，更注重结果。我们不需要“教”计算机该怎么做，只要告诉它一个目标状态，它自己就会想办法去完成任务，相比起来自动化、智能化程度更高。

来看一个例子：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: ngx-dep
  name: ngx-dep
  
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ngx-dep
      
  template:
    metadata:
      labels:
        app: ngx-dep
    spec:
      containers:
      - image: nginx:alpine
        name: nginx
```
注意里面的`replicas: 2`，这一句表示期望的副本数量。也就是说，要在集群中运行多少个实例。

我们只要声明期望的状态，Deployment对象就可以扮演运维监控人员的角色，自动地在集群里调整Pod的数量，这就是声明式的魅力。

为了更好的实现声明式，k8s使用了[YAML](https://yaml.org/)，它是JSON的一个超集。

#### API对象
YAML语言只相当于“语法”，要与Kubernetes对话，我们还必须有足够的“词汇”来表示“语义”。

作为一个集群操作系统，Kubernetes 归纳总结了 Google 多年的经验，在理论层面抽象出了很多个概念，用来描述系统的管理运维工作，这些概念就叫做“API 对象”。说到这个名字，你也许会联想到上次课里讲到的 Kubernetes 组件 apiserver。没错，它正是来源于此。

因为 apiserver 是 Kubernetes 系统的唯一入口，外部用户和内部组件都必须和它通信，而它采用了 HTTP 协议的 URL 资源理念，API 风格也用 RESTful 的 GET/POST/DELETE 等等，所以，这些概念很自然地就被称为是“API 对象”了。

{% asset_img api-resources.png API对象 %}

### 运行机制

Kubernetes的**Master/Node架构**是它具有自动化运维能力的关键，再用另一张参考架构图来简略说明一下它的运行机制。
{% asset_img kubernetes-control-plane.png Master/Node架构 %}

### 工作负荷（Workload）

工作负荷就是在k8s中运行的应用。而[pods](https://kubernetes.io/docs/concepts/workloads/pods/)是k8s管理应用的最小单位，所有的工作负荷都是从pod扩展出来的。

{% asset_img pod.webp pod %}

#### Pod

一个容器中只运行一个进程或应用。Pod可以解决联合运行的需求，但作为一个整体它又足够轻量。类似Docker中的compose project。

一个简单的pod：
```yaml
spec:
  containers:
  - image: busybox:latest
    name: busy
    imagePullPolicy: IfNotPresent
    env:
      - name: os
        value: "ubuntu"
      - name: debug
        value: "on"
    command:
      - /bin/echo
    args:
      - "$(os), $(debug)"
```

**问题**

如果你试一下，就会发现上面这个pod运行后的状态是`CrashLoopBackOff`。其实在docker里也是一样的，因为`/bin/echo`不是一个守护进程，它执行完就退出了，而不管是docker还是k8s，默认运行的都是在线服务，而不是一次性任务。

我们当然可以使用`tail -f /dev/null`或`exec /bin/bash -c "trap : TERM INT; sleep infinity & wait"`来保持进程不退出，但这样会占用资源，而且不够优雅。

#### Job/CronJob

为了解决离线任务的需求，k8s引入了job和cronjob。Job是一次性任务，而CronJob是定时任务。

**job**

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: echo-job

spec:
  template:
    spec:
      restartPolicy: OnFailure
      containers:
      - image: busybox
        name: echo-job
        imagePullPolicy: IfNotPresent
        command: ["/bin/echo"]
        args: ["hello", "world"]
```

{% asset_img job-yaml.png job %}

从这里可以感受到api对象的魅力。

**cronjob**

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: echo-cj

spec:
  schedule: '*/1 * * * *'
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
          - image: busybox
            name: echo-cj
            imagePullPolicy: IfNotPresent
            command: ["/bin/echo"]
            args: ["hello", "world"]
```

{% asset_img cronjob-yaml.png cronjob %}

#### Deployment

#### Daemonset

#### StatefulSet

### 服务与网络

#### Service

#### Ingress

### 配置与存储

#### ConfigMap/Secret

#### PersistentVolume

#### 资源限制

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ngx-pod-resources

spec:
  containers:
  - image: nginx:alpine
    name: ngx

    resources:
      requests:
        cpu: 10m
        memory: 100Mi
      limits:
        cpu: 20m
        memory: 200Mi
```
