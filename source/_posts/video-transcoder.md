---
title: 视频转码
date: 2022-06-18 20:44:28
tags: 善用佳软
description: 2022年了，除了ffmpeg应该还有更好选择。
---
你还在使用难用的[ffmpeg](https://ffmpeg.org)命令行吗，本期推荐的佳软是[HandBrake](https://handbrake.fr)。它提供了方便的UI界面，不再需要去查ffmpeg的文档了。

它当然也支持[命令行](https://handbrake.fr/docs/en/1.5.0/cli/cli-options.html)，

使用时一般不需要像ffmpeg一样[指定各种参数](https://ffmpeg.org/ffmpeg.html#Main-options)
```bash
ffmpeg -i {input}.mov -c:v libx264 -c:a aac -vf format=yuv420p -movflags +faststart {output}.mp4
```

直接使用[默认设置](https://handbrake.fr/docs/en/1.5.0/cli/cli-options.html)通常就会得到想到的结果
```bash
handbrakecli -i {input}.mov -o {output}.mp4
```

