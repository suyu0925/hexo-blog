---
title: 将苹果实况照片（Live Photos）上传到谷歌相册
date: 2023-11-08 14:12:20
tags:
description: 从iCloud上下载下来的实况照片是.heic和.mov的格式，直接上传到谷歌相册会是分开的两部分，不能像在iPhone上使用谷歌相册应用那样上传成一个动态照片。
---
## 苹果实况照片（Live Photos）

苹果的实况照片在文件系统中是一个.heic文件和一个.mov文件，前者是照片，后者是视频。

如果直接上传到谷歌相册，会被当成两个独立的文件，成为一张照片和一个视频。

## 上传至谷歌相册

如果在iOS设备上使用谷歌相册[iOS端](https://apps.apple.com/us/app/google-photos/id962194608)上传，会是一个动态照片。打开后默认是照片，点击后可以播放。

但如果经过中转，从iOS设备导出变成.heic和.mov两个文件（[icloudpd](https://github.com/boredazfcuk/docker-icloudpd)导出的格式是`IMG_7434.HEIC`和`IMG_7434_HEVC.MOV`），再通过谷歌相册应用[网页端](https://photo.google.com/)或者[安卓端](https://play.google.com/store/apps/details?id=com.google.android.apps.photos)上传，就会变成两个独立的文件。

## 试验：转换为谷歌动态照片上传

首先.heic文件可以使用[magick](https://imagemagick.org/)轻松转为兼容性更好的.jpg。
```bash
magick ./IMG_7434.HEIC ./IMG_7434.jpg
```

然后根据[Working with Motion Photos](https://medium.com/android-news/working-with-motion-photos-da0aa49b50c)这篇文章的分析，借助[MotionPhotoMuxer](https://github.com/mihir-io/MotionPhotoMuxer)工具，将其合并为一张动态照片。

得到的动态照片在[Motion-Photo-Viewer](https://github.com/dj0001/Motion-Photo-Viewer)上可以正常播放，但却无法使用谷歌相册应用网页端上传，会提示格式错误。

猜测是因为不支持HEVC格式，需要将视频转换为H.264格式。回头试试。
```bash
ffmpeg -i ./IMG_7434_HEVC.MOV -c:v libx264 ./IMG_7434.MOV
```

最新结果：转换为H.264格式后，谷歌相册应用网页端上传，一切正常。

写了一个docker来自动完成转换：[docker-live-photos-converter](https://github.com/suyu0925/docker-live-photos-converter)。

## 试验：将文件名改成完全一致

v2ex上[有个帖子](https://www.v2ex.com/t/895593)讨论了live photo，里面有人提到，需要将文件名改成完全一致。

[icloudpd](https://github.com/boredazfcuk/docker-icloudpd)导出的格式是`IMG_7434.HEIC`和`IMG_7434_HEVC.MOV`，文件名不一致。

改成`IMG_7434.HEIC`和`IMG_7434.MOV`上传后，还是不行。
