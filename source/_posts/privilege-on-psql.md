---
title: PostgreSQL中的用户权限
date: 2020-10-29 09:57:55
description: PostgreSQL的用户权限与其它SQL数据库不尽相同，它增加了一个SCHEMA。
tags:
---

# PostgreSQL中的用户权限

假设这样一个使用场景，我们有一系列服装商品在网上商城出售，消费者在商城注册账号，浏览商品，下订单购买。

后台使用了一个数据库emart，里面有users，products, orders三个表，分别对应消费者账号，产品信息，订单。

除了开发人员要使用数据库外，我们还需开放数据给运营人员和供应链人员，来迭代优化购买体验。

其中运营人员需要只读访问users表，来针对性的投放广告；供应链人员需要只读访问products和orders表，来调整仓储和供应链。

我们基于以上假设来创建数据库并细分权限。

## 常规初始化数据库

我们先试试常规的初始化流程，看看会发生什么。

先使用数据库管理员账号登录。

```bash
psql -U postgres
```

创建数据库emart和三个表。

```sql
CREATE DATABASE emart;
\c emart;

CREATE TABLE users (id int);
CREATE TABLE products (id int);
CREATE TABLE orders (id int);
```

创建三个角色，开发人员、运营人员和供应链人员。

```sql
CREATE ROLE dev; -- 开发组
GRANT ALL ON users TO dev;
GRANT ALL ON products TO dev;
GRANT ALL ON orders TO dev;

CREATE ROLE opr; -- 运营组
GRANT SELECT ON users TO opr;

CREATE ROLE scm; -- 供应链组
GRANT SELECT ON products TO scm;
GRANT SELECT ON orders TO scm;
```

创建三个用户，asher, bill, chris，分别对应开发人员、运营人员和供应链人员。

```sql
CREATE USER albert WITH PASSWORD 'albert_password';
CREATE USER bill WITH PASSWORD 'bill_password';
CREATE USER chris WITH PASSWORD 'chris_password';

GRANT dev TO albert;
GRANT opr TO bill;
GRANT scm to chris;
```

## 试验结果

现在我们使用供应链人员chris的账号登录，他有对products和orders的查询权限。
```bash
psql -U chris emart
```

```sql
emart=> SELECT * FROM users;
错误:  对表 users 权限不够
emart=> INSERT INTO orders(id) VALUES (1);
错误:  对表 orders 权限不够
emart=> SELECT * FROM products;
 id
----
(0 行记录)
```

## 似乎还有哪里不对

一切正常。但如果尝试下面的命令，那与我们的直觉不符。

```sql
emart=> \conninfo
以用户 "chris" 的身份, 在主机"localhost" (地址 "::1"), 端口"5432"连接到数据库 "emart".

emart=> \l
                                                            数据库列表
       名称        |  拥有者  | 字元编码 |            校对规则            |             Ctype              |       存取权限
-------------------+----------+----------+--------------------------------+--------------------------------+-----------------------
 emart             | postgres | UTF8     | Chinese (Simplified)_China.936 | Chinese (Simplified)_China.936 |
(1 行记录)

emart=> \d users
           数据表 "public.users"
 栏位 |  类型   | 校对规则 | 可空的 | 预设
------+---------+----------+--------+------
 id   | integer |          |        |
```

我们并不想让无关人员看到users表以及users表的列定义。

再比如
```sql
emart=> create table hello (id int);
CREATE TABLE
```

竟然可以创建新表，我们期望的难道不是一个只有读取权限账号吗。

## 迷题揭晓：[PSQL中的Schema](https://www.postgresql.org/docs/current/ddl-schemas.html)

在PostgreSQL创建一个表时，它会默认将表放在名为public的shcema下。比如这两条sql语句是一样的：
```sql
SELECT * FROM public.users;

SELECT * FROM users;
```

我们可以使用命令来查询当前数据库下的schema:
```sql
WITH "names"("name") AS (
  SELECT n.nspname AS "name"
    FROM pg_catalog.pg_namespace n
      WHERE n.nspname !~ '^pg_'
        AND n.nspname <> 'information_schema'
) SELECT "name",
  pg_catalog.has_schema_privilege(current_user, "name", 'CREATE') AS "create",
  pg_catalog.has_schema_privilege(current_user, "name", 'USAGE')  AS "usage",
  "name" = pg_catalog.current_schema() AS "current"
    FROM "names";

  name  | create | usage | current
--------+--------+-------+---------
 public | t      | t     | t
(1 行记录)
```

而这个名为public的shcema的定义是这样的：
```sql
GRANT ALL ON SCHEMA public TO PUBLIC;
```
`ALL`在schema中代表USAGE和CREATE这两个权限。

## 解决方案

很容易想到有两种解决方案，第一种是从public中去除USAGE和CREATE这两个权限，第二种是创建一个新的schema。

### 尝试一：修改public

使用管理员登录数据库emart，去除public对所有人的权限，改为对用户组开放。
```sql
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE USAGE ON SCHEMA public FROM PUBLIC;

GRANT ALL ON SCHEMA public TO dev;
GRANT USAGE ON SCHEMA public TO opr;
GRANT USAGE ON SCHEMA public TO scm;
```

这样修改完public后，opr和scm用户组就无法进行创建表的操作。但chris仍然能看到其它表和表结构，所以我们进行第二项尝试。

### 解决方法：创建新的schema

使用管理员账号登录，创建名为opr, scm的schema，给对应的用户组创建和使用的权限。
```sql
CREATE SCHEMA opr;
GRANT USAGE ON SCHEMA opr TO opr;
GRANT ALL ON SCHEMA opr TO dev;

CREATE SCHEMA scm;
GRANT USAGE ON SCHEMA scm TO scm;
GRANT ALL ON SCHEMA scm TO dev;
```

将表从public中移至对应的schema下。
```sql
ALTER TABLE users SET SCHEMA opr;
ALTER TABLE products SET SCHEMA scm;
ALTER TABLE orders SET SCHEMA scm;
```

### 最终效果

我们使用chris登录，尝试一下是否如我们所愿。
```sql
emart=> select * from opr.users;
错误:  对模式 opr 权限不够
第1行select * from opr.users;
                   ^
emart=> select * from scm.orders;
 id
----
(0 行记录)

emart=> create table opr.hello (id int);
错误:  对模式 opr 权限不够
第1行create table opr.hello (id int);
                  ^
```

不错，再试下查看表和表结构。
```sql
emart=> \d
              关联列表
 架构模式 | 名称  |  类型  | 拥有者
----------+-------+--------+--------
 public   | hello | 数据表 | chris
(1 行记录)
```
不对呀，连scm下的表都看不到了。

这是因为search_path没有设置的缘故。
```sql
emart=> SHOW search_path;
 search_path
-------------
 public
(1 行记录)

emart=> SET search_path TO scm,public;
SET
emart=> \d
                关联列表
 架构模式 |   名称   |  类型  |  拥有者
----------+----------+--------+----------
 public   | hello    | 数据表 | chris
 scm      | orders   | 数据表 | postgres
 scm      | products | 数据表 | postgres
(3 行记录)
```

搞定收工。
