---
title: 使用docker上的postgres代替本机安装
date: 2021-11-05 11:08:26
tags: [postgres, docker]
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
下一步是卸载本机的postgres，在卸载前先确认该备份的都已经备份好，包括。

## 运行docker版本
### docker-compose.yml
废话不多说直接列docker-compose.yml
```yml
version: '3'
services:
  db:
    container_name: pg12
    image: postgres:12
    command: postgres -c 'max_connections=200'
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: $POSTGRES_PASSWORD
      POSTGRES_DB: test_db
    ports:
      - 5432:5432
    volumes:
      - "pgdata:/var/lib/postgresql/data"
      - "pgswap:/pgswap"
  pgadmin:
    container_name: pgadmin4
    image: dpage/pgadmin4:latest
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: $PGADMIN_DEFAULT_EMAIL
      PGADMIN_DEFAULT_PASSWORD: $PGADMIN_DEFAULT_PASSWORD
      PGADMIN_LISTEN_PORT: 80
    ports:
      - 5050:80
    volumes:
      - "pgadmin:/var/lib/pgadmin"
networks:
  default:
    name: postgres12
volumes:
  pgdata:
    name: pgdata
  pgswap:
    name: pgswap
  pgadmin:
    name: pgadmin
```

### 配置

使用yml中的command我们可以指定[postgres的运行参数](https://www.postgresql.org/docs/12/config-setting.html#id-1.6.6.4.5)：

```yml
services:
  db:
    container_name: pg12
    image: postgres:12
    command: postgres -c 'max_connections=200'
```

[max_connections](https://www.postgresql.org/docs/12/runtime-config-connection.html#RUNTIME-CONFIG-CONNECTION-SETTINGS)的默认值是`100`，很难够用。做为对比参考，阿里云的postgresql服务是`500`。

### volumes

加入volumes可以将数据保持在host端，这样image升级或container重建就不会影响数据。

我们指定了volumes的名字，也可以使用host的相对目录`./data`。
指定volume的好处在于多个项目可以共享卷，使用相对目录可以更好的管理数据防止误删，可根据实际情况选择。

另外，自动生成的`volume_id`可以用`docker inspect -f '{{range.Mounts}}{{.Name}}{{end}}' pg12`语句来找到。

**postgresql**

`/var/lib/postgresql/data`是postgres存放数据库的目录，我们还定义了一个`/pgswap`卷用来存放之前备份的dump文件。

**pgadmin**

pgadmin只需要mount一个目录`/var/lib/pgadmin`，所有配置都存储在这个文件夹中。可参见[官方文档](https://www.pgadmin.org/docs/pgadmin4/development/container_deployment.html#mapped-files-and-directories)。

*注意*：
如果pgadmin卷是有从外部拷来的文件，需要确保pgadmin用户有读写权限，如果没有的话需要在host上设置：
```bash
sudo chown -R 5050:5050 <host_directory>
```
可使用root用户登录（root用户的uid为0）pgadmin容器来运行这个。
```bash
docker exec -u 0 -it pgadmin4 bash
```

### 从host中访问volumes

[docker官方推荐](https://docs.docker.com/storage/volumes/#backup-restore-or-migrate-data-volumes)不要直接从host中访问volumes，如果是需要备份，可以用docker命令，可参见[讨论帖](https://github.com/microsoft/WSL/discussions/4176)。

如果使用的是wsl2 (Ubuntu)，

docker的卷可在host上的`\\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes\${volume_id}\_data`找到，

因为docker中的`/var/lib/docker/`被映射到了`\\wsl$\docker-desktop-data\version-pack-data\community\docker\`。

但如果使用的不是wsl2而是Hyper-V后端，那么`/var/lib/docker`会被映射到`C:\Users\Public\Documents\Hyper-V\Virtual hard disks`。

**从wsl中访问**

如果想从wsl中访问`\\wsl$`，可以用虚拟盘符来做一个跳转。

首先映射一个w盘
```powershell
net use w: \\wsl$\docker-desktop-data
```

然后在wsl中映射w盘
```bash
sudo mkdir /mnt/docker
sudo mount -t drvfs w: /mnt/docker
```
这样在wsl中就能通过`/mnt/docker/version-pack-data/community/docker/volumes/${volume_id}/_data`来访问到volume内容了。

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
docker exec -it pg12 /bin/sh
psql -U postgres -f ./dump/dumpall.sql
```

中间会报几个database不存在的错误，可手动创建。
