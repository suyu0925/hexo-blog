---
title: 开源直播软件obs
date: 2023-01-10 11:57:09
tags: 善用佳软
description: 虽然obs是一个直播软件，但它也可以用作虚拟摄像头。
---
这期的善用佳软是一款[开源](https://github.com/obsproject/obs-studio)直播软件[Open Broadcaster Software(OBS)](https://obsproject.com/)。

支持Windows是肯定的，同时还支持macOS，甚至丧心病狂的支持了Linux。

软件的界面长这个样子：

{% asset_img "ui.png" "主界面" %}

软件的设计者讲求极简，设置一目了然。

如果要当作虚拟摄像头使用，可以在自动配置向导中选择：

{% asset_img "only-for-virtual-camera.png" "只使用虚拟摄像头" %}

如果你的电脑没有硬件摄像头，在启动虚拟摄像机后，打开windows自带的Camera应用，会发现仍然无法找到摄像头。此时不要困惑，因为Camera应用只识别硬件摄像头，会忽略虚拟摄像头。

我们换成钉钉或腾讯会议，就会发现OBS Camera了。

{% asset_img "dingtalk.png" "钉钉中的摄像头" %}

注意，当OBS设置为虚拟摄像头时，它真正输出的是预览界面水平翻转后的画面，因为使用摄像头的软件默认会将摄像头画面水平翻转。

钉钉很不错，提供了“开启镜像”的开关，我们取消掉就行了。腾讯会议也提供了“视频镜像”的开关。

{% asset_img "tencent-meeting.png" "腾讯会议中的摄像头" %}

如果软件没有提供水平翻转的开关，我们可以在OBS里将来源放进一个分组，然后给分组设置一个水平翻转的变换。只是这样预览就变成镜像了。
