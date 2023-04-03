---
title: web阅读器：hectorqin-reader
date: 2022-11-23 15:43:28
tags: 
- 善用佳软
description: iOS上一直都没有像安卓上的阅读那样的靠谱开源小说阅读器，这回介绍一个web版。
---
安卓上的[阅读](https://github.com/gedoor/legado)算得上是小说阅读器终结者了，用它搭配上[书源](https://gedoor.github.io/blog/tags/%E4%B9%A6%E6%BA%90)，简直横扫一切。

iOS就没这么好命，从前有[爱阅书香](https://mp.weixin.qq.com/s/fSvBGlbljxCOcNp3ZbjvVw)，后来有[源阅读](https://github.com/kaich/Yuedu)，现在啥也没。

但iOS用户永不为奴，办法总比困难多。这不，出现了一作web版的阅读器：[hectorqin-reader](https://github.com/hectorqin/reader)。

## 运行

直接使用docker-compose启动即可，搭配{% post_link frp frp %}即可实现手机阅读。

```yaml
version: '3.1'
services:
  reader:
    image: hectorqin/reader
    container_name: reader # 容器名 可自行修改
    restart: always
    ports:
      - 4396:8080 # 4396端口映射可自行修改
    networks:
      - share_net
    volumes:
      - ./logs:/logs # log映射目录 /home/reader/logs 映射目录可自行修改
      - ./storage:/storage # 数据映射目录 /home/reader/storage 映射目录可自行修改
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - READER_APP_USERLIMIT=50 # 用户上限,默认50
      - READER_APP_USERBOOKLIMIT=200 # 用户书籍上限,默认200
      - READER_APP_CACHECHAPTERCONTENT=true # 开启缓存章节内容 V2.0
      # 下面都是多用户模式配置
      - READER_APP_SECURE=true # 开启登录鉴权，开启后将支持多用户模式
      - READER_APP_SECUREKEY=password  # 管理员密码  建议修改
      # - READER_APP_INVITECODE=registercode #注册邀请码 建议修改,如不需要可注释或      
networks:
  share_net:
    driver: bridge
```

## 使用

用手机访问网址，再导出到“添加到主屏幕”就好啦。

管理员账号是admin，密码见上面的`READER_APP_SECUREKEY`环境变量。

## 书源

- [源仓库](http://yck.mumuceo.com/)

源仓库经常因为访问量过大404，404时可以试试[备用网址](http://YckCeo.Vip)。

- [legado.git.llc](https://legado.git.llc/)

不知道是不是官方的。

- [秀儿](https://github.com/XIU2/Yuedu)

网友`xiu2`整理的书源。

## 小说下载

如果不想在线阅读想全本下载，可以上[知轩藏书](http://zxcs.me/)下载txt文件。
