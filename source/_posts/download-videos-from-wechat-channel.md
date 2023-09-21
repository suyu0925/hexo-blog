---
title: 从微信视频号下载视频
date: 2023-09-21 20:22:12
tags:
- 生活
description: 有时候我们看到微信视频号里的内容觉得很好，想下载下来收藏，但微信不提供下载功能，此时我们可以这样做。
---
首先要嗅探到视频源网址。

目前主流的工具就两个：[fiddler](https://www.telerik.com/fiddler)和[Wireshark](https://www.wireshark.org/)。

其中，fiddler是付费软件，但使用简单。Wireshark是开源软件，使用稍微复杂一些。注意Wireshark依赖[Npcap](https://npcap.com/#download)，如果打开Wireshark后发现不能搜索本地连接，需要先安装Npcap。

以fiddler为例，打开fiddler并设置为全局代理后，打开微信，进入视频号，随便点开一个视频，然后在fiddler中搜索`mp4`，就能找到视频源网址了。

{% asset_img fiddler.png "fiddler" %}

拷贝视频源网址后，还不能直接使用。我们需要做一个变换。
使用node运行：
```javascrypt
const url = 'https://finder.video.qq.com/251/20302/stodownload?encfilekey=6xykWLEnztKcKCJZcV0rWCM8ua7DibZkibqXGfPxf5lrpteNmgRthfr2GQudfV22yAlrjd5JVdib1lLRz9QBeXjY07iaHiaTItxv0eicXE3tOic4Sh8OB8icvTPUk44BZ5oI4y5uHIS1PIeetIjrEHY3m7SciavGDEV4BYXEBoqfm0ibNf2Ec&a=1&bizid=1023&dotrans=0&hy=SH&idx=1&m=ddc7922f4d11bd65d29ebc8a6ad2ec39&upid=500210&web=1&token=cztXnd9GyrEIlJgJcWcYuc4ekicWAGNRz4YXMsykxia1qQUS0rRYe3VKQZj3Jxjs51VFJwTzbXxMGmBdMicGlrcDbzIUica8qiaiazyYczBZFMLXCkXktLM8ZlSicyic7aHjy7vO&ctsc=140&extg=8f002e&svrbypass=AAuL%2FQsFAAABAAAAAABel4eromOcsAfhIz8MZRAAAADnaHZTnGbFfAj9RgZXfw6VeMtIx2sjOPIJzNMM20%2BQjuNloyBpYTjR1oiktX9dih8%3D&svrnonce=1695301411&fexam=1&X-snsvideoflag=xW22'
const urlObj = new URL(url)
const encfilekey = urlObj.searchParams.get('encfilekey')
const token = urlObj.searchParams.get('token')
const newUrl = new URL(urlObj.origin + urlObj.pathname.replace('/20302/', '/20304/'))
newUrl.searchParams.set('encfilekey', encfilekey)
newUrl.searchParams.set('token', token)
console.log(newUrl.toString())
```
得到：
```url
https://finder.video.qq.com/251/20304/stodownload?encfilekey=6xykWLEnztKcKCJZcV0rWCM8ua7DibZkibqXGfPxf5lrpteNmgRthfr2GQudfV22yAlrjd5JVdib1lLRz9QBeXjY07iaHiaTItxv0eicXE3tOic4Sh8OB8icvTPUk44BZ5oI4y5uHIS1PIeetIjrEHY3m7SciavGDEV4BYXEBoqfm0ibNf2Ec&token=cztXnd9GyrEIlJgJcWcYuc4ekicWAGNRz4YXMsykxia1qQUS0rRYe3VKQZj3Jxjs51VFJwTzbXxMGmBdMicGlrcDbzIUica8qiaiazyYczBZFMLXCkXktLM8ZlSicyic7aHjy7vO
```

这个链接无法直接在浏览器中打开，需要使用[Neat DM](https://www.neatdownloadmanager.com/)下载，ndm在{% post_link neat-download-manager "下载软件idm的替代品：ndm" %}中有介绍过。

下载完成后，默认的文件名是`stodownload.jpg`。将文件扩展为改为`.mp4`，即得到可播放的源视频文件。
