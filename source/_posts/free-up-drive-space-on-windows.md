---
title: windows下清理硬盘空间
date: 2021-11-11 14:36:35
tags: 善用佳软
description: 随着应用数据越来越大，而我们却一直保留着硬盘分区的习惯，系统盘越来越容易不够用。推荐一个神器吧。
---
一般说到硬盘空间不足，第一个想到的就是使用windows自带的`磁盘清理`了。微软也帮我们整理了[一套攻略](https://support.microsoft.com/en-us/windows/tips-to-free-up-drive-space-on-your-pc-4d97fc4a-0175-8d49-ac2f-bcf27de46d34)。

步骤为：
* 搜索`磁盘清理(disk clean)`，`以管理员身份运行`磁盘清理(%windir%\system32\cleanmgr.exe)，然后选择你想要清理的分区
* 上面这步也可以从资源管理器->右键点击分区盘符->属性->磁盘清理这个路径来进入
* 如果没有`以管理员身份运行`，需要再次进入`清理系统文件`
* 通常这里会有2个大东西可以删除，分别是：老的windows和windows更新清理

但上面这个不是我要推荐的重点，我要推荐的工具叫[TreeSize Free](https://www.jam-software.com/treesize_free)。

它可以将我们硬盘中所有文件夹扫描出来，以大小排序。这样非常方便查看空间被哪个目录给占用了，可以有针对性的处理。

重要的是，免费版的功能就已经足够，而且绝不逼逼让人付费。

{% asset_img "TreeSizeFree-Columns-View.png" "文件树" %}

{% asset_img "TreeSizeFree_0.png" "图形化" %}
