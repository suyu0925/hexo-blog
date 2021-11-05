---
title: 使用docker上的postgres代替本机安装
date: 2021-11-05 11:08:26
tags: postgres docker
description: 自从有了docker，恨不得把所有软件都搬进去，以保持系统纯净
---
本机安装postgresql后，pgadmin4老是提示版本低，但升级起来却麻烦，不如直接塞到docker里去，更新什么的简单不要太方便。

## 先备份
先把老有的数据库备份
```bash
pg_dumpall -U postgres -f ./dump/dumpall.sql
```

注意[pg_dumpall](https://www.postgresql.org/docs/12/app-pg-dumpall.html)只会提取role、tablespaces、schema、data，并不会把数据库的创建语句dump出来。

如果数据库不多，可以在之后的恢复中手动创建。

## 卸载
下一步是卸载本机的postgres

## 运行docker版本
### docker-compose.yml
废话不多说直接列docker-compose.yml
```yml
version: '3'
services:
  db:
    container_name: pg12
    image: postgres:12
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: $POSTGRES_PASSWORD
      POSTGRES_DB: test_db
    ports:
      - "5432:5432"
    volumes:
      - "./data:/VAR/LIB/POSTGRESQL/DATA"
      - "./dump:/dump"
  pgadmin:
    container_name: pgadmin4
    image: dpage/pgadmin4
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: $PGADMIN_DEFAULT_EMAIL
      PGADMIN_DEFAULT_PASSWORD: $PGADMIN_DEFAULT_PASSWORD
    ports:
      - "5050:80"
networks:
  default:
    name: postgres12
```
**volumes**

注意这里我们把postgres中的data目录mount到了`./data`，以方便未来的迁移需求。

如果这里不加`volumes`设置，则data目录会被mount在`\\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\${volume_id}`。

`volume_id`可以用`docker inspect -f '{{range.Mounts}}{{.Name}}{{end}}' pg12`语句来找到。

### 环境变量
一些设置我们使用`.env`来实现。
```ini
COMPOSE_PROJECT_NAME=postgres12
POSTGRES_PASSWORD=password
PGADMIN_DEFAULT_EMAIL=admin@email.com
PGADMIN_DEFAULT_PASSWORD=password
```

### 运行
```bash
docker-compose up -d
```

在pgadmin的网页中，连接postgres的hostname填`pg12`即可

## 恢复数据
```bash
docker exec -it pg12 /bin/bash
psql -U postgres -f ./dump/dumpall.sql
```

中间会报几个database不存在的错误，可手动创建。
