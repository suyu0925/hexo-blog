---
title: 介绍一下sed命令
date: 2024-09-04 10:11:10
tags:
description: cheatsheet.
---
[sed](https://www.gnu.org/software/sed/manual/sed.html)是在绝大多数linux发行版中内置的文本处理工具，在我们需要基于规则修改配置文件时特别有用。

比如在使用debian源时，就经常会用到：`sudo sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list`。

这里记录一些常见用法。

## 命令行参数

```sh
sed OPTIONS... [SCRIPT] [INPUTFILE...]
```

只解释几个最常用的参数。

### -i

`-i`代表`in-place`，相当于把输出保存到一个临时文件，最后再替换原文件。

## script

script分为几种动作，分别是：

- a: 新增
- c: 取代
- d: 删除
- i: 插入
- p: 打印
- s: 取代

先创建一个`testfile`，下面都用这个文件来测试。

```txt
# plain text
HELLO LINUX!  
Linux is a free unix-type opterating system.  
This is a linux testfile!  

# yaml
google:
  url: https://google.com
hello:
  url: http://127.0.0.1:8000/hello
```

### a

在第二行添加`newline`。

```sh
cat testfile | sed '2a\newline'
sed 2anewline testfile
sed -e 2anewline -f testfile
```

### s

将yaml部分的hello.url的host，从`127.0.0.1`改成`example.com`。

```sh
cat testfile | sed '/^hello:/,/^[^ ]/ s|\(url:\s*http[s]\?://\)[^/:]\+|\1example.com\2|'
```

`/^hello:/,/^[^ ]/`是一个选择器，详细解释一下：

1. `^hello:`
表示以`hello:`打头

2. `,`
`,`是`sed`中用于分隔范围的两个边界，它表示从第一个匹配的行开始，到第二个匹配的行结束

3. `^[^ ]`

- 外面的`^`表示行的开头
- `[^ ]`是一个否定字符类，匹配任何非空字符
- 连起来`^[^ ]`匹配以非空字符开头的行

综合起来，`/^hello:/,/^[^ ]/`表示从匹配`hello:`的行开始，到匹配以非空字符开头的行结束。这个范围选择器确保只处理包含`hello:`的块，不会影响到其他部分。
