---
title: 挑选阿里云云服务器（ECS）配置
date: 2024-06-04 15:00:16
tags:
description: 阿里云 ECS 算是用得最多的云服务器了，记录一下如何挑选配置。
---

## 付费类型

首先是选择[付费类型](https://help.aliyun.com/zh/ecs/product-overview/overview-51)，阿里云提供了三种付费类型：

- 包年包月
- 按量付费
- 抢占式实例

抢占式实例最便宜，但在保护期过后会被释放，只适合用于做一些试验性的工作。

最常用的是包年包月服务，大多数情况都选它，也只有它才支持备案服务。

按量付费适合不确定使用时间的场景，比如跑测试、或者临时扩容应对突发流量等。

## 地域和可用区

### 地域

[地域](https://help.aliyun.com/document_detail/40654.html#concept-z04-bg5-j8w)需要小心选择，资源创建后将无法更换。

一般根据两个因素来选择：

1. 离用户尽量近，虽然静态内容有 CDN，但 api 请求还是会走服务器；
2. 备案。如果有，最好选择经营地的地域，比如北京。

### 可用区

[可用区](https://help.aliyun.com/document_detail/40654.html#concept-0ai-gof-5y7)和地域一样，在资源创建后也将无法更换。

可用区是同一地域内的独立数据中心，各区之间故障隔离，可以提高容灾能力。但与地域不同的是，同一地域下不同可用区之间内网互通，延迟要比不同地域小得多。

选择可用区的唯一因素是资源可用情况，不同的[ECS 实例规格族可购买地域](https://ecs-buy.aliyun.com/instanceTypes/)有所不同，比如[ecs.g7.xlarge](https://help.aliyun.com/zh/ecs/user-guide/overview-of-instance-families#g7)在华东 1（杭州）只在可用区 B、I、J、K 有售。

多台 ECS 要不要放在同一个可用区，取决于对内网的延迟和容灾能力的需求。

### 专用网络

[专有网络 VPC](https://help.aliyun.com/zh/vpc/user-guide/overview-of-proprietary-networks-and-switches)是阿里云提供的一种网络隔离服务，可以在一个 VPC 内创建多个子网，子网之间、子网与外网的连通可以自由控制。

专用网络和交换机可在 ECS 创建后更换。

## 实例

ECS 有很多[实例规格族](https://help.aliyun.com/zh/ecs/user-guide/overview-of-instance-families)，根据架构和使用场景可以分为：

- 企业级 x86 计算规格族群
- 企业级 ARM 计算规格族群
- 企业级异构计算规格族群
- 弹性裸金属服务器规格族群
- 高性能计算实例规格族群
- 共享型 x86 计算规格族群

普通用户选择企业级 x86 计算规格族群即可，其它的需求有更好选择（比如 AI 推理可以直接用[hugging face](https://huggingface.co/inference-endpoints/dedicated)），[ECS 选型最佳实践](https://help.aliyun.com/zh/ecs/use-cases/best-practices-for-instance-type-selection)基本不用看。

至于具体的规格选择，现在一般都用 docker 部署，选 CPU 核数和内存为 1：4 的通用就好，比如 2 核 8G、4 核 16G。如果对内存特别有需求，就选 1：8 的内存型，比如 2 核 16G。

CPU 核心比想象的要猛，如果访问量不大，基本 2 核就够用。

规格代数选次新最佳，比如现在最新的是第 8 代，将要淘汰的是第 6 代，那么第 7 代就是性价比最佳之选，比如[ecs.g7](https://help.aliyun.com/zh/ecs/user-guide/overview-of-instance-families#g7)和[esc.r7](https://help.aliyun.com/zh/ecs/user-guide/overview-of-instance-families#9e4ed29e73q6z)。

## 操作系统

操作系统的选择也比较无脑，除非是开发 windows 应用，否则不建议 windows server，因为对资源的要求比 linux 高。

而在 linux 家族里，首选 Ubuntu，它的社区最活跃，碰到问题最容易得到解决。

版本建议选[最新的 LTS](https://ubuntu.com/download/server)，目前是 24.04。因为是云服务器，其实带不带 UEFI 无所谓，如果要[可信系统](https://help.aliyun.com/zh/ecs/user-guide/overview-of-trusted-computing-capabilities)就选 UEFI。

## 存储

除非有动态挂载的需求才选择数据盘，否则直接一块系统盘完事，免去挂载的麻烦。

注意 docker 也比较吃硬盘，image、volume、container、build 都会占用大量空间。60G 是一个比较合理的起点。

## 公网

### 带宽

[公网的带宽计费](https://help.aliyun.com/zh/ecs/product-overview/public-bandwidth#ded55580efdf7)分两种：固定带宽和使用流量。

除非网络利用率一直很高，不然在[中国特有国情](https://www.bilibili.com/video/BV1z84y117Ab/)下，无脑选流量。绝大部分的网络请求都是需求高带宽，不需求长时间。100Mbps 的固定带宽一年的费用高达近 8 万，换成使用流量将近 100TB（[每 GB 只要 8 毛钱](https://help.aliyun.com/zh/ecs/product-overview/public-bandwidth#section-gxl-ntk-zdb)）。

### 弹性 IP

如果需要把 IP 暴露给第三方，不论是使用 IP 直接访问，还是微信、钉钉白名单，那么使用[弹性 IP](https://help.aliyun.com/zh/eip/eip-overview)可以让切换服务器变得更简单。不论服务器怎么更换，对外的公网 IP 都不会变。

按使用流量花费的话，弹性 IP 需要额外花费每小时 2 分钱，折合到一年约 175 元。要不要掏这笔钱就取决于在第三方处更改 IP 麻不麻烦啦。

~~如果是按固定带宽，且有多台 ECS，那么弹性 IP 成为必选，因为可以[共享带宽](https://help.aliyun.com/zh/internet-shared-bandwidth/product-overview/what-is-internet-shared-bandwidth)。~~

忘记共享带宽当它不存在吧，从 2020 年开始，[它的带宽下限改为 1000Mbps](https://help.aliyun.com/zh/internet-shared-bandwidth/product-overview/limits)，一年 815600 元。

## 登录凭证

### 登录名

登录名尽量不要用 root，因为 root 是系统管理员，权限太大，容易被黑客利用。建议登录名使用[ecs-user](https://help.aliyun.com/zh/ecs/user-guide/manage-the-username-used-to-log-on-to-an-ecs-instance)，仅在需要 root 权限时再使用 sudo 提权。此时 root 的密码需要[另外设置](https://help.aliyun.com/zh/ecs/user-guide/manage-the-username-used-to-log-on-to-an-ecs-instance#e64800027faj8)。
