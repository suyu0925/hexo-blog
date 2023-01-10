---
title: 导出和导入docker数据卷
date: 2023-01-10 14:57:52
tags:
- docker
description: 自从把常用后台软件放进docker后，docker数据卷的备份就成为刚需。
---
docker卷的备份可以使用一个临时容器来挂载卷很轻松的完成：
```powershell
docker run --rm `
  -v "$VOLUME_NAME:/backup-volume" `
  -v "$(pwd):/backup" `
  busybox `
  tar -zcvf /backup/my-backup.tar.gz /backup-volume
```

也可以导入：
```powershell
docker run --rm `
  -v "$VOLUME_NAME:/backup-volume"
  -v "$(pwd):/backup" `
  busybox `
  tar -xvzf /backup/my-backup.tar.gz -C /
```

可以参考[docker-vackup](https://github.com/BretFisher/docker-vackup)这个bash脚本。

不过现在有个更易用的工具：[Volumes Backup & Share](https://hub.docker.com/extensions/docker/volumes-backup-extension)扩展。

可以看看官方的[介绍博客](https://www.docker.com/blog/back-up-and-share-docker-volumes-with-this-extension/)。

{% asset_img "volumes-backup-share-extension.gif" "Volumes Backup & Share" %}

但要注意的是，这个扩展导出的压缩包格式是[.zst](https://docs.fileformat.com/compression/zst/)，它使用的压缩算法是facebook的[zstd](https://github.com/facebook/zstd)，普通的压缩软件比如[7z](https://www.7-zip.org/)是不支持的。

zstd官方提供了[命令行工具](https://github.com/facebook/zstd/releases)，我们还可以使用集成了zstd的[7-Zip-zstd](https://github.com/mcmilk/7-Zip-zstd)来代替官方7z。
