---
title: 在docker里使用cron
date: 2022-03-02 11:18:36
tags: docker
description: 虽然可以在代码里使用schedule，但也想偷个懒试试用cron。
---
[cron](https://en.wikipedia.org/wiki/Cron)是*nix操作系统上的一个计划任务管理工具。

## 使用方法

[cron]命令(https://linux.die.net/man/8/cron)是一个服务程序，在后台运行任务。可以使用`-f`使它保持在前台。

[crontab]命令(https://linux.die.net/man/1/crontab)用来管理任务。

## 开始

直接从创建一个最简单的Dockerfile开始。

```dockerfile
FROM ubuntu:20.04

# install cron
RUN apt-get update && apt-get -y install cron

# touch log file for tail
RUN touch /root/cron.out

# add the cron job
RUN crontab -l | { cat; echo "* * * * * echo hello from cron job >> /root/cron.out"; } | crontab -

# go
CMD cron && tail -f /root/cron.out
```
 
运行结果：
```sh
> docker build -t first .
> docker run -it --rm first
hello from cron job
hello from cron job
hello from cron job
hello from cron job
```

## 使用sh

接下来我们试试使用`cron`运行`sh`。

新建一个`out_time.sh`：
```bash
now=$(date +"%T")
echo "Current time : $now" >> /root/cron.out
```

搭配dockerfile：
```dockerfile
FROM ubuntu:20.04

# install cron
RUN apt-get update && apt-get -y install cron

# copy sh
COPY out_time.sh /root/out_time.sh

# touch log file for tail
RUN touch /root/cron.out

# add the cron job
RUN crontab -l | { cat; echo "* * * * * bash /root/out_time.sh"; } | crontab -

# go
CMD cron && tail -f /root/cron.out
```
 
运行结果：
```sh
> docker build -t use_sh .
> docker run -it --rm use_sh
Current time : 06:09:01
Current time : 06:10:01
Current time : 06:11:01
```

## 使用cron file

这次我们将cron job写在文件里。

新建`cronfile`：
```sh
* * * * * bash /root/out_time.sh

```

如果使用cron file，这里有两点需要注意：
1. 最后一行一定要有个空行
2. 文件的回车格式为`LF`，不能是`CRLF`


搭配dockerfile：
```dockerfile
FROM ubuntu:20.04

# install cron
RUN apt-get update && apt-get -y install cron

# copy sh and cron file
COPY out_time.sh /root/out_time.sh
COPY cronfile /root/cronfile

# touch log file for tail
RUN touch /root/cron.out

# add the cron job
RUN crontab /root/cronfile

# go
CMD cron && tail -f /root/cron.out
```

效果与把命令直接在Dockerfile里一致。

## 最后完整的来个starter

test.py
```python
import datetime
from pandas import DataFrame

now = datetime.datetime.now()
df = DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6]}, index=[now, now + datetime.timedelta(days=1), now + datetime.timedelta(days=2)])
print(df)
```

requirements.txt
```txt
pandas
```

Dockerfile
```Dockerfile
FROM ubuntu:20.04

# use mirror for apt
RUN sed -i 's/http:\/\/archive.ubuntu.com\/ubuntu\//http:\/\/mirrors.cloud.tencent.com\/ubuntu\//g' /etc/apt/sources.list
RUN sed -i 's/http:\/\/security.ubuntu.com\/ubuntu\//http:\/\/mirrors.cloud.tencent.com\/ubuntu\//g' /etc/apt/sources.list

# install cron and python3
RUN apt-get update && apt-get -y install cron python3 python3-pip
RUN link /usr/bin/python3 /usr/bin/python

# set workdir
WORKDIR /app

# pip install
COPY requirements.txt requirements.txt
RUN pip install -i https://repo.huaweicloud.com/repository/pypi/simple -r requirements.txt

# copy python files
COPY . .

# touch log file for tail
RUN touch cron.out

# add the cron job
RUN crontab -l | { cat; echo "* * * * * python /app/test.py >> /app/cron.out"; } | crontab -

# go
CMD cron && tail -f cron.out
```
