---
title: 使用pgsync同步postgres与elasticsearch
date: 2021-11-11 09:16:56
tags: [postgres, elasticsearch]
description: 当我们需要搜索非结构化数据时时，首先考虑的是elasticsearch，但又想保持唯一可信数据源postgres，此时可考虑使用python库pysnc来实现。
---
## [pgsync](https://pgsync.com/)
[pgsync](https://pgsync.com/)是一个中间件，用来将postgres中的数据同步至elasticsearch。

只需要定义一下[schema](https://pgsync.com/schema/)，剩下的事都只可以交给它了。

## 使用需求

### 需要[userepl](https://www.postgresql.org/docs/current/view-pg-user.html)权限的数据库账户

为了开启监听，pgsync需要创建[replication slots](https://www.postgresql.org/docs/current/warm-standby.html#STREAMING-REPLICATION-SLOTS)，此操作需要userepl权限。

可使用sql语查询具有权限的用户：
```sql
SELECT usename FROM pg_user WHERE userepl = true;
```

### [logical decoding](https://www.postgresql.org/docs/current/logicaldecoding.html)

为了监听到所有修改，需要将[postgres.conf](https://www.postgresql.org/docs/current/config-setting.html)中的[wal_level](https://www.postgresql.org/docs/current/runtime-config-wal.html)从默认的replication改为logical。

可使用sql语句查询当前设置：
```sql
SHOW wal_level;
```

修改wal_level可以直接修改`postgres.conf`，也可使用[ALTER SYSTEM](https://www.postgresql.org/docs/current/sql-altersystem.html)。

**注意**：修改wal_level需要**重启postgres**才会生效。我们可以通过sql语句查看wal_level的定义。
```sql
SELECT * FROM pg_settings WHERE name ='wal_level';
```

**postgres.conf**
postgres.conf的文件位置可使用sql语句查询：
```sql
SHOW config_file;
--- /var/lib/postgresql/data/postgresql.conf
```
打开文件直接修改即可。
```conf
wal_level = logical                    # minimal, replica, or logical
```

**[ALTER SYSTEM](https://www.postgresql.org/docs/current/sql-altersystem.html)**
使用ALTER SYSTEM语句来修改。
```sql
ALTER SYSTEM SET wal_level = logical;
```
ALTER SYSTEM会将设置值存入`postgres.auto.conf`，在启动时覆盖`postgres.conf`中的设置。

### [max_replication_slots](https://www.postgresql.org/docs/14/logical-replication-config.html)

要监听数据变化至少需要一个replication slot，不能为0。可使用sql语句查询当前最大个数：
```sql
SHOW max_replication_slots;
```

本地安装的默认值是10，阿里云上的RDS是64。

### 阿里云RDS

如使用阿里云RDS，可参考最佳实践相关文档：[开发运维建议](https://www.alibabacloud.com/help/zh/doc-detail/281785.html)和[逻辑订阅](https://www.alibabacloud.com/help/zh/doc-detail/119393.html?spm=a2c63.p38356.0.0.342ffd5a7jqWGy)。

## [schema](https://pgsync.com/schema/)

[schema](https://pgsync.com/schema/)是核心，在常规使用时，只需要修改schema文件就可以完成所有操作。

可参考官方文档中给出的各种[例子](https://pgsync.com/tutorial/json-fields/)。

## 运行pgsync

pgsync的使用分为两步，第一步创建triggers和logical replication slot，第二步启动同步守护。

### bootstrap

```bash
bootstrap --config /path/to/schema.json
```

### sync

```bash
pgsync --config /optional/path/to/schema.json --daemon
```

如果不想使用命令行，或者是在windows下使用，也可使用纯python，参见[bootstrap](https://github.com/toluaina/pgsync/blob/master/bin/bootstrap)和[pgsync](https://github.com/toluaina/pgsync/blob/master/bin/pgsync)命令的实现。

### 环境变量

在使用python时要注意[环境变量](https://pgsync.com/env-vars/)要否成功设置，可考虑使用[python-dotenv](https://saurabh-kumar.com/python-dotenv/)在一开始就载入。

## 注意事项

打开逻辑订阅后会极大的增加硬盘使用量，一定要监控硬盘使用量，避免硬盘爆掉。

[max_wal_size](https://postgresqlco.nf/doc/en/param/max_wal_size/)只是一个软限制，在高负载的情况下会超出这个值。

在阿里云RDS中，每周的备份会极大的增加wal占用的容量。一个20G硬盘的实例打开逻辑订阅后会在一周内爆掉，推荐值未知，待观察。
