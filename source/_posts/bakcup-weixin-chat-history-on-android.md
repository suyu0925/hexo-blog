---
title: 备份微信聊天记录-android篇
date: 2024-05-14 14:38:55
tags:
  - weixin
description: 上一篇文章介绍了微信聊天记录的备份，这篇文章详情介绍一下安卓。
---

## 连接安卓设备

参考{% post_link use-mumu-emulator-for-android-development 使用MuMu模拟器进行android开发 %}。

## 存储结构

**多用户**

`uin`是微信对账号生成的一个 id，存储在`/data/data/com.tencent.mm/shared_prefs/auth_info_key_prefs.xml`中的`_auth_uin`。

**聊天记录**

聊天记录放在`/data/data/com.tencent.mm/MicroMsg/{md5('mm'+uin)}/EnMicroMsg.db`数据库中。

**图片**

图片存放在`/data/data/com.tencent.mm/MicroMsg/{md5('mm'+uin)}/image2`目录下。

图片存放路径是两级目录，比如`cd/6c/th_cd6cd62684419459895117183a26978b`，看上去像是 hash 后的两次索引。可能是因为图片太多，为了提高查找速度。

微信收到一张别人发过来的图片后，会有 3 种形式：

1. 缩略图，不管有没有查看，都会存一份，体积最小最模糊；
2. 大图，点开查看才会开始下载，超时就打不开了；
3. 原图，要手动点击查看原图才会下载。

**视频**

视频存放在`/data/data/com.tencent.mm/MicroMsg/{md5('mm'+uin)}/video`目录下。

多半是因为视频不像图片那么多，所以没有像图片那样分路径，全部一股脑的存放在这个目录下。

文件命名规则是`yyMMddHHmmss`再加 4 位数字，比如`2405141411232641`。扩展名为`.mp4`。

微信收到一个别人发过来的视频后，也会有 3 种形式：

1. 视频预览缩略图`{file_id}.jpg`，不管有没有查看，只要收到就会存一份，体积很小；
2. 点击查看后，会下载`{file_id}.mp4`视频文件；
3. 点击查看原视频后，会下载原视频`{file_id}origin.mp4`。

**语音**

语音存放在`/data/data/com.tencent.mm/MicroMsg/{md5('mm'+uin)}/voice2`目录下。

语音也像图片那样，做了索引，存放在两级目录下。扩展名是`.amr`。比如`e4/26/msg_13141905142479bebcac2e0102.amr`。

虽然扩展名是`.amr`，但实际上却使用了 skype 同款编码格式[SILK](https://en.wikipedia.org/wiki/SILK)，一般的播放器都不支持，所以需要使用[silk-v3-decoder](https://github.com/kn007/silk-v3-decoder)进行转码。

**文件**

文件索引数据库在`/data/data/com.tencent.mm/MicroMsg/{md5('mm'+uin)}/WxFileIndex.db`。索引到 Download 文件夹。

**Download**

Download 文件夹与其它目录不同，它在所有应用可访问的`sdcard`区，而不是微信私有的`/data/data/com.tencent.mm`区。

在`/sdcard/Android/data/com.tencent.mm/MicroMsg/Download`。存放着当前手机上所有微信聊天时发送的文件，这里文件例如：文档，安装包、压缩包等。

## 数据库解密

移动端的解密则相对简单。

先拿到上面说过的`uin`值，然后在`uin`前面贴上`IMEI`，再将这个字符串做`md5`，将得到的`md5`值前`7`位转成小写就是解密使用的密钥。
用代码来表示类似`md5(imei + uin).substring(0, 7).toLowerCase()`。

这段操作可以在使用[ApkTool](https://github.com/iBotPeaches/Apktool)反编译微信 apk 包后的 smali 代码中搜索`Lcom/tencent/mm/storagebase/IMEISave;->a()Ljava/util/Collection;`查到。
有兴趣的同学可以自行逆向分析一下。

微信使用的`IMEI`在`com.tencent.mm.storagebase.IMEISave`类中读取，如果`IMEI`读取失败，默认值是`1234567890ABCDEF`。

`IMEI`在手机上可以通过拔号`*#06#`获得，或者进入`设置`下的`关于手机`查看。

可以参考这篇博客：[解密安卓微信聊天信息存储](https://blog.greycode.top/posts/android-wechat-bak/)。

## 解密后查看

可以使用[decode-micro-msg](https://github.com/suyu0925/decode-micro-msg)来解密：

```sh
docker run --rm -v ${pwd}:/data -e DECODE_KEY=${your_decode_key} lckof/decode-micro-msg
```

运行完后会生成解密好的`MicroMsg.db`，可以使用[sqlitebrowser](https://sqlitebrowser.org/)查看。

虽然[sqlitebrowser](https://sqlitebrowser.org/)从[3.9.0](https://github.com/sqlitebrowser/sqlitebrowser/releases/tag/v3.9.0)开始就支持了 sqlcipher，但不能用来查看 android 导出的微信数据库，因为微信使用的 sqlcipher 配置不是标准的。

{% spoiler 微信使用的配置 %}
微信使用的 sqlcipher 配置是：

```java
public static final SQLiteCipherSpec l = (new SQLiteCipherSpec()).setPageSize(1024).setSQLCipherVersion(1);
```

`SQLiteCipherSpec`的[代码片断](https://github.com/Tencent/wcdb/blob/9d26c39475d4294204e467e139e3bbf8f7e3ea58/src/java/compat/src/main/java/com/tencent/wcdb/compat/SQLiteCipherSpec.java#L193)：

```java
public SQLiteCipherSpec setSQLCipherVersion(int version) {
  switch (version) {
    case 1:
      cipherVersion = 1;
      hmacEnabled = false;
      kdfIteration = 4000;
      hmacAlgorithm = HMAC_SHA1;
      kdfAlgorithm = HMAC_SHA1;
      break
    // ...
  }
  return this;
}
```

{% endspoiler %}
