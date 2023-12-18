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

顺便记录一些常见的占用大量空间的目录：

- [yarn cache](https://classic.yarnpkg.com/lang/en/docs/cli/cache/)

缓存目录在`$env:LocalAppData\Yarn\Cache`，可通过`yarn cache list`查看。

使用`yarn cache clean`清除。

- [npm cache](https://docs.npmjs.com/cli/v10/commands/npm-cache)

缓存目录在`$env:LocalAppData\npm-cache`，可通过`npm cache verify`查看。

使用`npm cache clean --force`清除。

- [pip cache](https://pip.pypa.io/en/stable/cli/pip_cache/)

缓存目录在`$env:LocalAppData\pip\cache`，可通过`python -m pip cache info`查看。

使用`python -m pip cache purge`清除。

- [chromium service worker cache storage](https://chromium.googlesource.com/chromium/src/+/master/content/browser/service_worker/README.md#Storage)

Edge和Chrome都基于chromium，所以都有这个缓存，只是目录的路径不同。
Edge的在`$env:LocalAppData\Microsoft\Edge\User Data\Default\Service Worker\CacheStorage`，Chrome的在`$env:LocalAppData\Google\Chrome\User Data\Default\Service Worker\CacheStorage`。
Service Worker的缓存被归类在`Cookies and other site data`中，所以如果想安全的删除它们，可以使用浏览器的清除数据功能，但这样会把所有的cookie也清除掉。
一个粗暴的方法是直接从文件管理器中删除这个目录，通常不会引起其它问题。

- [QQ个人文件夹](https://guanjia.qq.com/knowledge-base/content/1175)

QQ默认的个人文件夹在`$env:UserProfile\Documents\Tencent Files`。推荐放在UserProfile里估计是为了安全考虑。如果电脑没有别人在用，其实可以改成放在其它盘符，以节省系统盘空间。

- [docker](https://docs.docker.com/config/pruning/)

docker有两个占用空间的部分，一个是镜像文件，另一个是卷文件。

镜像文件可以通过`docker image prune`清理，卷文件可以通过`docker volume prune`清理。

但在windows下，清理完卷文件后可能还需要对vhdx文件进行优化，参见{% post_link reduce-size-of-docker-volume 减少docker卷在windows的占用空间 %}。
