---
title: 浅谈微服务化
date: 2023-04-25 15:08:27
description: 拿一个项目当作样例，浅谈一下微服务。
---
## 引子

假设目前有这样一个项目：

{% asset_img original_architecture.png 原先架构 %}

我们可以发现，在这个项目中，存在着诸多可优化的地方：

- Api服务
需要将Api服务拆分成两个应用，数据平台和策略报告。这两个服务的数据模型和业务逻辑都不一样，应该分开来维护。并且应该允许使用不同的技术构型。

- 静态网页
为了提供更好的可访问性，我们通常会将网页部署到CDN上，这样可以提高网页的访问速度，减轻服务器的压力。
即使不用部署到CDN，也应该使用IIS或者Nginx等Web服务器来提供静态网页服务，而不是使用应用。

- Api网关
在接入层应该配置一层Api网关，将IP白名单、访问频率限制等安全相关工作交给网关。

### 改进

我们尝试完成上述的改进，将静态网页挪至接入层；将数据平台和策略报告做成两个独立的服务；在各个服务之前添加Api网关。得到了这样的架构：

{% asset_img improved_architecture.png 改进后架构 %}

其实这种改进就是一种微服务化，将原先的单体应用拆分成多个松散耦合、细粒度的服务，这些服务通过轻量级协议进行通信，可以独立开发和部署。

## 微服务

对微服务架构的定义，[维基百科](https://zh.wikipedia.org/zh-cn/%E5%BE%AE%E6%9C%8D%E5%8B%99)、[AWS](https://aws.amazon.com/cn/microservices/)、[谷歌](https://cloud.google.com/learn/what-is-microservices-architecture?hl=zh-cn)、[微软](https://learn.microsoft.com/zh-cn/azure/architecture/microservices/)、[IBM](https://www.ibm.com/cn-zh/topics/microservices)等都有自己的描述，但大同小异，重点都一样：
- 众多/可缩放
- 小型/细粒度
- 松散耦合
- 可单独部署
- 通过轻量级协议进行通信

### 优势
微服务的这些特点可以带来明显的优势：
- 敏捷性
微服务可以独立开发、测试和部署，这样可以让开发人员更快的交付新功能。
- 多语言编程
每个微服务都可以使用不同的编程语言和技术栈，这样可以让开发人员使用最适合的工具来完成工作。
- 错误隔离
单个微服务的错误不会中断整个应用程序。
- 可伸缩性
可以很方便的横向扩展某个子系统，而不用扩展整个应用程序。
- 小型团队
每个微服务都足够小，一个小团队就能维护，保证工作效率。

### 挑战
但微服务的优势并非毫无代价，它也会带来一些挑战：
- 复杂性
虽然微服务化后，每个单独的服务变得更简单，但整个系统作为整体，却变得更加复杂了，需要在设计上投入更多的精力。
- 服务治理和管理
微服务化后，服务数量会大幅增加，无法再像单体应用那样手动管理，需要使用工具来进行有效的治理和管理，包括服务发现、负载均衡、故障恢复、监控和跟踪等方面。
- 数据一致性
为提升效率，每个微服务都可能会负责自己的数据暂留，因此保持数据最终一致性可能是个挑战。
- 技能集
使用微服务需要具备更多的技能，比如DevOps、容器编排、服务网络等，会带来学习成本。

### 使用微服务框架
为了能让开发人员更轻松的开发、测试和部署微服务，很自然的形成了微服务框架。比如：[Spring Cloud](https://spring.io/projects/spring-cloud)、[Dubbo](https://dubbo.apache.org/en/index.html)、[Dapr](https://dapr.io/)、[Go-Micro](https://github.com/go-micro/go-micro)。

在这些框架中，我们选择Dapr深入看一下。

### 易混淆的概念
在深入之前，先探索一下微服务框架、容器编排、服务网络这三者的区别。

在微服务架构中经常能看到这三个名词，虽然它们的目的都是更好的构建可扩展的分布式应用程序，但职责和作用均不同。

- 微服务框架（Microservice Framework）

微服务框架是一种编程模型，它提供了一组工具和库，使得开发人员可以更轻松地编写、测试和部署微服务。
它也会提供一些微服务架构中常见的功能，比如服务注册和发现、故障恢复、监控和跟踪等。
它的重点是构建和管理微服务。
常见的微服务框架有：[Spring Cloud](https://spring.io/projects/spring-cloud)、[Dubbo](https://dubbo.apache.org/en/index.html)、[Dapr]((https://dapr.io/))、[Go-Micro](https://github.com/go-micro/go-micro)。

- 容器编排（Container Orchestration）

容器编排是一种自动化部署和管理容器的技术，它允许开发人员将应用程序打包为容器，并通过容器编排平台来自动化部署和管理这些容器。
容器编排平台通常提供了自动缩放、负载均衡、故障恢复等功能，以降低运维成本和提高应用程序的可靠性。
它重点关注自动化部署和管理容器。
常用工具有：[Kubernetes](https://kubernetes.io/)、[Docker Swarm](https://docs.docker.com/engine/swarm/)。

- 服务网络（Service Mesh）

服务网络是一种基础设施层面的技术，用于管理多个服务之间的通信。
它提供了服务发现、负载均衡、流量控制等功能，以确保服务之间的通信稳定性和可靠性。
它主要关注运行时服务间的通信。
常见的服务网络平台有：[Istio](https://istio.io/)、[Linkerd](https://linkerd.io/)、[Consul](https://www.consul.io/)。

## Dapr

Dapr是一个可移植的、事件驱动的运行时，使得任何开发者都能够轻松构建具有弹性、无状态和有状态的应用程序，并在云端和边缘上运行，并支持多种语言和开发框架。

光看描述很虚，直接看构架图。

{% asset_img dapr-overview.png Dapr总览 %}

下面的云端和边缘我们不关心，只看上面微服务部分。Dapr提供了一系列组件，通过HTTP API和gRPC API的调用方式与应用集成。

### 构建块（Building Block）

在设计微服务应用时，需要考虑很多因素。Dapr设计了一系列常用功能的最佳实践，以构建块的形式供开发人员使用。

{% asset_img dapr_building_blocks.png 构建块一览 %}

最经常使用的有：
- 服务调用
最常用的功能，封装微服务之间的函数调用。
- 状态管理
为了可伸缩性，微服务本身通常是无状态的，将状态放到外部。
- 发布订阅
微服务之间的事件通知。

### 旁路架构
Dapr使用旁路架构的方式来公开构建块的API，不需要微服务应用包含任何Dapr运行时代码。
- 集成简单，不限制应用的开发语言。
- 逻辑隔离，提高扩展性。

{% asset_img dapr-overview-sidecar-model.png 旁路架构 %}

### 托管环境

Dapr有两种托管方式：自托管（本地开发）和kubernetes。

**自托管（本地开发）**

在自托管模式中，Dapr以一个单独的旁路进程随微服务应用一同运行，微服务应用可以通过HTTP或gPRC访问Dapr旁路进程的构建块。

在`dapr init`后，Dapr会在docker中启动三个容器，用来服务Dapr运行时。
- Redis容器
Dapr使用Redis来存储状态和配置信息，以及发布订阅。
- Zipkin容器
Dapr使用Zipkin来收集跟踪数据。
- Placement容器
Dapr使用Placement服务来管理应用程序的状态。

{% asset_img dapr-overview-standalone.png 自托管模式 %}

**自托管（本地开发）- 无需docker**

dapr运行时也可以[不依赖docker](https://docs.dapr.io/operations/hosting/self-hosted/self-hosted-no-docker/)，使用`dapr init --slim`安装即可。

这样就只会安装：
- daprd
- placement

但因为没有安装默认组件（比如redis），所以只有`服务调用`可用。还需要进行更多配置才能正常使用。

- 状态管理和发布订阅
{% post_link redis-on-windows 安装redis %}后，才能使用状态管理和发布订阅。

- [打开actors的支持](https://docs.dapr.io/operations/hosting/self-hosted/self-hosted-no-docker/#enable-state-management-or-pubsub)

**kubernetes**

而在kubernetes托管方式下，Dapr以一个旁路容器的形式，与微服务应用容器运行在同一个pod中。

为此，需要使用`dapr init -k`在kubernetes中部署4个服务：
- dapr-operator
管理[组件](https://docs.dapr.io/operations/components/)的更新，以及dapr用到的k8s服务端点。
- dapr-sidecar-injector
将Dapr旁路容器注入到应用程序容器中。
- dapr-placement
管理应用程序[actors](https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/)的状态。
- dapr-sentry
管理证书认证以及服务间的mTLS通信。

{% asset_img dapr-overview-kubernetes.png kubernetes托管方式 %}

## 附录

### 在服务器上安装dapr slim

dapr的默认安装方式为在线安装，需要访问放在github上的文件，对网络环境无法完全控制的服务器不友好。我们试试看能不能脱机安装。

#### 安装dapr cli

官方推荐的安装方式为
```powershell
powershell -Command "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"
```

`install.ps1`干了这么几件事：
- 拉取[dapr cli的最新发布版本信息](https://github.com/dapr/cli/releases)
- 下载[dapr cli的zip包](https://github.com/dapr/cli/releases/download/v1.10.0/dapr_windows_amd64.zip)
- 解压`dapr.exe`到`$Env:SystemDrive\dapr`
- 添加`$Env:SystemDrive\dapr`到`%PATH%`环境变量

#### dapr init --slim

官方推荐的安装方式为
```powershell
dapr init --slim
```

它会在`%USERPROFILE%/.dapr`下创建文件树：
- bin
  - web
  - dashboard.exe
  - daprd.exe
  - placement.exe
- components
  - statestore.yaml
  - pubsub.yaml
- config.yaml
同时将`%USERPROFILE%/.dapr/bin`加入`%PATH%`环境变量。

daprd.exe是dapr运行时。
placement.exe是为actors服务的。
这两个文件可以在[dapr的release](https://github.com/dapr/dapr/releases/tag/v1.10.5)中下载。

[dashboard.exe](https://github.com/dapr/dashboard/releases/tag/v0.12.0)是dapr的[dashboard](https://github.com/dapr/dashboard)，可以通过`dapr dashboard`启动。

components下是默认的组件配置，包括statestore和pubsub。
config.yaml是dapr的默认配置。
这三个文件都是由[代码生成](https://github.com/dapr/cli/blob/master/pkg/standalone/standalone.go#L676)。
