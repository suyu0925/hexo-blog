---
title: 如何使用包管理在ubuntu16.04上安装java
date: 2018-01-21 11:57:30
description: ubuntu16.04？现在已经没什么人用了吧。不用点进来了。
tags:
- linux
- java
categories: 
- computer science
---
## 安装默认JRE/JDK

最简单的安装方式就是安装默认的OpenJDK8。

```bash
sudo apt-get update
sudo apt-get install default-jre
sudo apt-get install default-jdk
```

## 安装Oracle JDK

如果要安装oracle java，那么官方默认源里是没有的，我们使用第三方源。

```bash
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
```

接下来就可以安装oracle jdk8或者jdk9
```bash
sudo apt-get install oracle-java8-installer
```
```bash
sudo apt-get install oracle-java9-installer
```

## 修改ppa
webupd8team的更新经常不及时，比如截止到目前2018-01-19，webupd8team/java上的java8仍然是144版本，但是oracle已经更改了链接，所以直接使用会提示404错误，找不到安装包，我们需要手动修改ppa。

先将144升级到152
```bash
cd /var/lib/dpkg/info
sudo sed -i 's|JAVA_VERSION=8u144|JAVA_VERSION=8u152|' oracle-java8-installer.*
sudo sed -i 's|PARTNER_URL=http://download.oracle.com/otn-pub/java/jdk/8u144-b01/090f390dda5b47b9b721c7dfaa008135/|PARTNER_URL=http://download.oracle.com/otn-pub/java/jdk/8u152-b16/aa0333dd3019491ca4f6ddbe78cdb6d0/|' oracle-java8-installer.*
sudo sed -i 's|SHA256SUM_TGZ="e8a341ce566f32c3d06f6d0f0eeea9a0f434f538d22af949ae58bc86f2eeaae4"|SHA256SUM_TGZ="218b3b340c3f6d05d940b817d0270dfe0cfd657a636bad074dcabe0c111961bf"|' oracle-java8-installer.*
sudo sed -i 's|J_DIR=jdk1.8.0_144|J_DIR=jdk1.8.0_152|' oracle-java8-installer.*
```

再将152升级到161
```bash
cd /var/lib/dpkg/info

sudo sed -i 's|JAVA_VERSION=8u151|JAVA_VERSION=8u161|' oracle-java8-installer.*
sudo sed -i 's|PARTNER_URL=http://download.oracle.com/otn-pub/java/jdk/8u151-b12/e758a0de34e24606bca991d704f6dcbf/|PARTNER_URL=http://download.oracle.com/otn-pub/java/jdk/8u161-b12/2f38c3b165be4555a1fa6e98c45e0808/|' oracle-java8-installer.*
sudo sed -i 's|SHA256SUM_TGZ="c78200ce409367b296ec39be4427f020e2c585470c4eed01021feada576f027f"|SHA256SUM_TGZ="6dbc56a0e3310b69e91bb64db63a485bd7b6a8083f08e48047276380a0e2021e"|' oracle-java8-installer.*
sudo sed -i 's|J_DIR=jdk1.8.0_151|J_DIR=jdk1.8.0_161|' oracle-java8-installer.*
```

接下来再次安装oracle-java8-installer就行了。
```bash
sudo apt-get install oracle-java8-installer
```

## 管理java版本

如果希望多个java版本并存，就需要进行切换。

```bash
sudo update-alternatives --config java
```

以下是一个示例输出
```output
There are 5 choices for the alternative java (providing /usr/bin/java).

  Selection    Path                                            Priority   Status
------------------------------------------------------------
* 0            /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java   1081      auto mode
  1            /usr/lib/jvm/java-6-oracle/jre/bin/java          1         manual mode
  2            /usr/lib/jvm/java-7-oracle/jre/bin/java          2         manual mode
  3            /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java   1081      manual mode
  4            /usr/lib/jvm/java-8-oracle/jre/bin/java          3         manual mode
  5            /usr/lib/jvm/java-9-oracle/bin/java              4         manual mode

Press <enter> to keep the current choice[*], or type selection number:
```

如果只有一个java版本，就会是这样的输出
```output
There is only one alternative in link group java (providing /usr/bin/java): /usr/lib/jvm/java-8-oracle/jre/bin/java
Nothing to configure.
```

接下来可以针对不同的*命令*来切换版本，典型的*命令*有javac, javadoc, jarsigner。
```bash
sudo update-alternatives --config $command
```

## 设置环境变量JAVA_HOME

很多应用都会使用$JAVA_HOME来调用java可执行文件，所以我们需要在安装完后设置$JAVA_HOME。

首先找到当前使用的java环境目录。
```bash
sudo update-alternatives --config java
```

然后将找到的目录添加进环境变量。

打开/etc/environment。
```bash
sudo vi /etc/environment
```

加入JAVA_HOME的设置。
```output
JAVA_HOME="/usr/lib/jvm/java-8-oracle"
```

保存文件，并且加载它。
```bash
source /etc/environment
```

验证修改是否成功
```bash
echo $JAVA_HOME
```

到此java8的安装就完成啦。
