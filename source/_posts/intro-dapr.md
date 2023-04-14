---
title: 介绍一下dapr
date: 2023-04-14 11:17:59
tags:
description: 最近在拆分微服务，介绍一下dapr。
---
Distributed application runtime[(Dapr)](https://dapr.io/)的是一种面向微服务的开发框架，由微软[开源](https://github.com/dapr/dapr)。

## 三种技术

在介绍Dapr之前，要先探索一下微服务框架、容器编排、服务网络这三者的区别。

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

Dapr只是微服务框架，[不是服务网络](https://docs.dapr.io/concepts/service-mesh/)。它的目标是让开发人员更加专注于业务逻辑，而无需关注底层基础设施。它本身不包含服务网络与容器编排，但可以通过开放标准的方式很好的与其他云原生技术进行集成。

## 核心概念

开局一张图。

{% asset_img overview.png 概述 %}

### 旁路（Sidecar）

Dapr使用旁路架构(作为容器或进程)暴露其HTTP和gRPC API，不需要应用程序代码包含任何Dapr运行时代码。这使得从其他运行时可以轻松集成Dapr，并提供应用逻辑的隔离，提高了可扩展性。

{% asset_img overview-sidecar-model.png 概述 %}

### 构建块（Building Block）

Dapr提供了一些常用功能的最佳实践，开发人员可以采用其中一个或多个来构建应用。

- 服务调用（Service-to-service invocation）
  服务调用使应用程序能够通过Http/gRPC消息形式相互通信。Dapr提供了一个端点（Endpoint），它充当反向代理与内置服务发现的组合，同时内置分布式跟踪和错误处理。
- 状态管理（State management）
  应用程序状态是应用程序想要保留在单个会话之外的任何内容。 Dapr 提供基于键 / 值的状态 API ，使用可插拔的状态存储进行持久化。
- 发布订阅（Publish and subscribe）
  发布/预订是松散耦合的消息传递模式，发送方 (或发布者) 将消息推送到订阅者预订的主题。 Dapr 支持应用程序之间的发布/订阅模式。
- 资源绑定（Bindings）
  绑定提供一个外部云与本地服务或系统的双向连接。 Dapr 允许您通过 Dapr 绑定 API 调用外部服务，也可以通过已连接的服务发送的事件来触发应用程序。
- Actors
  参与者是孤立的独立计算单元，具有单线程执行。 Dapr提供了基于Virtual Actor模式的actor实现，该模式提供了单线程编程模型，并且在不使用actor时会对其进行垃圾回收。
- 可观测性（Observability）
  Dapr 系统组件和运行时记录 metrics，log 和 trace 以调试，操作和监视 Dapr 系统服务，组件和用户应用程序。
- 密钥（Secrets）
  Dapr 提供一个机密构建块 API ，并与 Azure Key Vault 和 Kubernetes 等机密商店集成，以存储机密。 服务代码可以调用密钥 API 从 Dapr 支持的密钥存储中检索密钥。
- 配置（Configuration）
  配置 API 可以让你从支持的配置存储中检索和订阅应用程序配置项。这使得应用程序能够在启动时或在存储中进行配置更改时检索特定的配置信息。
- 分布式锁（Distributed lock）
  分布式锁 API允许你对资源进行加锁，这样应用程序的多个实例就可以访问该资源而不会发生冲突，并提供一致性保证。
- 工作流（Workflows）
  Workflow API可以使用Dapr工作流或工作流组件定义跨多个微服务的长时间运行的持久性进程或数据流。Workflow API可以与其他Dapr API构建块结合使用。例如，工作流可以通过服务调用调用另一个服务或检索凭据，从而提供灵活性和可移植性。
