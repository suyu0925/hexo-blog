---
title: 部署docker数据卷
date: 2023-01-10 16:46:58
tags:
- docker
description: docker私有源只能存放image，那volume数据卷要怎么部署呢？进来探讨一下。
---
## 使用压缩包
最简单的办法就是把数据卷导出成一个压缩包，然后使用ssh传输到服务器上去使用，当然也可使用需鉴权的文件服务器做为中转。

数据卷的导出和导入可参考这篇博文：{% post_link backup-and-share-docker-volume 导出和导入docker数据卷 %}。

## 使用image
还有一个方法是把数据卷也打包进docker image里上传到docker私有源。

首先在编译镜像时，把数据卷拷入，同时设置卷标
```dockerfile
FROM alpine:latest
COPY ./volumes/webroot /webroot
VOLUME ["/webroot"]
```
附：如果使用docker-compose，需要访问上级目录，可参照[附录: 使用context](#附录使用context)

然后在使用这个镜像时，就可以把镜像中的webroot mount到本地数据卷：
```bash
docker run --rm --mount source=my-webroot,destination=/webroot/ sv-webroot:1.0.0
```

## 附录：使用context
如果要拷贝上级目录的内容，可以分别指定context和dockerfile来实现：
```yml
  webroot-builder:
    build:
      context: ./
      dockerfile: ./webroot/Dockerfile
    image: sv-webroot:1.0.0
    depends_on:
      - web-builder
```