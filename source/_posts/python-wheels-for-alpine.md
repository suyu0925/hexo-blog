---
title: "在python:alpine的docker映像中安装依赖出错"
date: 2023-11-16 14:48:22
tags:
description: 最近在写一个docker映像，基于python:alpine，在安装依赖时出错。
---
[alpine](https://www.alpinelinux.org/)是linux家族中的一个超小发行版，在docker生态中很受欢迎，毕竟体积足够小，基本功能也满足需求。所以有很多基于alpine的docker映像，比如[python:alpine](https://github.com/docker-library/python/blob/402b993af9ca7a5ee22d8ecccaa6197bfb957bc5/3.12/alpine3.18/Dockerfile)。

最近基于`python:alpine`写了一个项目，要使用[pyexiv2](https://github.com/LeoHsiao1/pyexiv2)包。但发现怎么装都是装的老版本[2.5.0](https://github.com/LeoHsiao1/pyexiv2/releases/tag/v2.5.0)而不是最新的[2.8.3](https://github.com/LeoHsiao1/pyexiv2/releases/tag/v2.8.3)。

在pyexiv2的issue中搜了下，发现出现[相同问题](https://github.com/Exiv2/exiv2/issues/2173)的都是arm64的mac，而我的docker环境是最常见的x86_64。

使用`pip intsall -vvv pyexiv2`查看安装过程，发现所有的wheels都没匹配上。

对比2.5.0和2.8.3的sheels，终于发现区别：2.5.0的linux wheels是`manylinux1_x86_64`，而2.8.3则是`manylinux2014_x86_64`。

查了下[manylinux](https://github.com/pypa/manylinux)，发现是一个标准，用于解决linux下的二进制兼容性问题。

目前有这些版本：
- [PEP 513](https://peps.python.org/pep-0513/) manylinux1
- [PEP 571](https://peps.python.org/pep-0571/) manylinux2010
- [PEP 599](https://peps.python.org/pep-0599/) manylinux2014
- [PEP 600](https://peps.python.org/pep-0600/) manylinux_x_y

pyexiv2 v2.5.0使用的manylinux1支持musl（alpine使用的libc库），manylinux2014不支持musl，所以无法匹配alpine。

已经有人提了[pre-PEP](https://discuss.python.org/t/pep-656-platform-tag-for-linux-distributions-using-musl/7165)，要重新支持在容器中大热的alpine，形成了[PEP 656 – Platform Tag for Linux Distributions Using Musl](https://peps.python.org/pep-0656/)，目前[已经完成](https://github.com/pypa/manylinux/commit/e184e460f3cef8ca2eae6e5f29bf6e1905216a0a)。

但要各个包开发者都从`manylinux2014`切换过来还需要一段时间，所以目前还是使用[python:slim](https://hub.docker.com/_/python/tags?page=1&name=slim)镜像吧。
