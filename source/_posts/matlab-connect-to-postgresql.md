---
title: matlab连接postgresql
date: 2020-11-30 09:30:09
tags: matlab
description: matlab用的不多，记录备忘。
categories: 
- computer science
---
本文章基本摘自matlab[官方文档](https://www.mathworks.com/help/database/ug/postgresql-jdbc-windows.html)，如果想获取更详细信息可以访问。

## 下载PostgreSQL JDBC driver

如果之前没有配置过JDBC，那么第一步是前往[postgresql官网](https://jdbc.postgresql.org/download)下载JDBC驱动。

要注意的是，一定要下载**匹配的java版本**。

比如MATLAB R2018b对应的java版本是java 8，那么必须使用PostgreSQL JDBC 4.2；
而如果MATLAB R2018b对应的java版本是java 7，那么则需使用PostgreSQL JDBC 4.1。

下面matlab命令可以查看适配的java版本。
```matlab
>> version -java

ans =

    'Java 1.8.0_152-b16 with Oracle Corporation Java HotSpot(TM) 64-Bit Server VM mixed mode'

>> 
```

## 安装PostgreSQL JDBC driver

JDBC driver只是一个jar文件，还需要让matlab能读到。

matlab[搜索java库](https://www.mathworks.com/help/matlab/matlab_external/java-class-path.html)有两种方式，[静态路径](https://www.mathworks.com/help/matlab/matlab_external/static-path-of-java-class-path.html)和[动态路径](https://www.mathworks.com/help/matlab/matlab_external/dynamic-path-of-java-class-path.html)。前者更简单，我们用这个。

matlab会在启动时读取用户首选项文件夹下的javaclasspath.txt来载入java路径，我们只需要将下载好的jar路径写入这个文件。

* 在matlab中编辑javaclasspath.txt
```matlab
cd(prefdir)
edit javaclasspath.txt
```
* 在文件末尾添加jar文件路径
```
c:\Users\matlab\Downloads\postgresql-42.2.18.jar
```
* 重启matlab让它加载

## 直接代码走起

如果是急性子，现在就已经可以运行SQL查询了。具体使用方法可参见[官网文档](https://www.mathworks.com/help/database/ug/database.html)。

```matlab
%% Make connection to database
conn = database('database-name','username','password','Vendor','POSTGRESQL','Server','server-host','PortNumber',port-number);

%% Execute query and fetch results
data = fetch(conn,['SELECT * ' ...
    'FROM schema.table']);
%% Close connection to database
close(conn)
```

## 使用matlab内置的Database Explorer来查看数据

打开app标签下的Database Exploerer：

{% asset_img "matlab-app.png" "matlab app" %}

配置JDBC数据源：

{% asset_img "matlab-database-explorer-1.png" "matlab app" %}

添加PostgreSQL JDBC数据源：

{% asset_img "matlab-database-explorer-2.png" "matlab app" %}

创建查询：

{% asset_img "matlab-database-explorer-3.png" "matlab app" %}

选择刚才添加的数据源：

{% asset_img "matlab-database-explorer-4.png" "matlab app" %}

输入账号密码即可连接预览：

{% asset_img "matlab-database-explorer-5.png" "matlab app" %}
