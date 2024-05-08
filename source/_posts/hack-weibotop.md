---
title: 破解微博热搜时光机
date: 2024-05-08 15:11:29
tags:
description: 想看看过去某天的微博热搜是什么，网上搜了下发现一个网站：热搜时光机。
---

它应该是有在按分钟爬取[微博实时热搜](https://s.weibo.com/top/summary?cate=realtimehot)，入库后再提供界面给用户查询。

但使用网页的方式有点局限，想看看它支不支持 api 访问，于是有了这篇文章。

## 初探

首先按下 F12 打开浏览器的开发者工具。立即发现调试程序已暂停，无法进行查看网络请求等操作。

{% asset_img breakpoint.png 断点 %}

好嘛，为了防止其他开发者破解，搞得这么严实吗，这反而激起了我奇怪的好胜心。

通过断点所提示的代码：

```javascript
(function anonymous() {
  debugger;
});
```

以及 callstack 调用堆栈，很容易发现作者加了这么一段：

```javascript
setInterval(function () {
  Function('Function(arguments[0]+"bugger")()')("de", 0, 0, 0);
}, 500);
```

利用的是[debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger)在声明时默认会触发调试器断点，这一步操作应该就能挡住非开发者的窥视。

我们取消`Pause on debugger statement`或者干脆停用断点后，选择恢复脚本执行（F8）即可跳过这段。

## 查看网络请求

随便修改一下时间，查看网页上的网络请求。可以看到有两次请求：

- https://api.weibotop.cn/getclosesttime?timestamp=lKAKyrL4a6BgfTZtBPfr7sT5QWj%2BZtF%2FnVXIqQgJKw8%3D
- https://api.weibotop.cn/currentitems?timeid=Jf%2Fnb%2B7htC8C6fsg3kkuqw%3D%3D

从字面意思看，`getclosesttime`应该是将用户输入的时间转换成数据库中有数据的最接近的时间，`currentitems`则是拉取热搜数据。

这两个链接并没有对 http header 做判断，任何人直接访问这个 api 都可以获取结果，你可以点击链接试一试。作者应该是加密了`timestamp`和`timeid`参数来避免 api 被滥用。

## 破解

查看脚本，能发现网站就只有两个 js 脚本。一个是 main.js，另一个是 vue 库。

打开 main.js，搜索`currentitems`关键字，可以直接找到。

{% asset_img search-currentitems.png "搜索 currentitems" %}

这么看作者并没有做增强混淆，只是做了常规的[最小化](https://github.com/terser/terser)，反混淆并不是必须。但为了可读性更好，我们仍然可以跑一次反混淆。

### 反混淆

虽然使用 Edge 打开源代码后会自动格式化，但 Firefox 和 Chrome 不行（怎么感觉反过来了），就算不用反混淆也需要做个简单的格式化。

反混淆可以使用[开源项目](https://github.com/kuizuo/js-deobfuscator)[js-deobfuscator](https://deobfuscator.kuizuo.cn/)，效果并不是很好，但聊胜于无吧。

反混淆后使用[vscode](https://code.visualstudio.com/)打开，选择语言为`javascript`，这样就可以使用 IDE 的代码跳转功能（比如跳转到定义、跳转到引用）。

**currentitems**

首先搜索`currentitems`，能够找到`let o = "https://api.weibotop.cn/currentitems"`。

通过`o`，可以找到它的调用：

```javascript
if (i != null) {
  e().get(
    o,
    {
      timeid: i,
    },
    function (t) {
      let e = h(t);
      n(e);
    }
  );
} else {
  e().get(o, function (t) {
    let e = h(t);
    n(e);
  });
}
```

### 模块结构

先看一下函数`e()`是什么：

```javascript
var t = i(755);
var e = i.n(t);
```

再看一下函数`i()`：

```javascript
var e = {};
function i(n) {
  var o = e[n];
  if (o !== undefined) {
    return o.exports;
  }
  var r = (e[n] = {
    exports: {},
  });
  t[n].call(r.exports, r, r.exports, i);
  return r.exports;
}
```

看起来`i()`是[类似 UMD 标准](https://gist.github.com/bndynet/30d1bb41b410a022919e87780ae0d62a)的一个 wrapper，本质上`i(755)`就是调用`t[755]`。我们可以发现`t`就是最外层的对象：

```javascript
(() => {
  var t = {
    734: function (t, e, i) {
      (function (t, e, i) {
        "use strict";

        function n(t) {
          if (t && typeof t == "object" && "default" in t) {
```

`t[755]`是这个函数：

```javascript
755: function (t, e) {
  var i;
  (function (e, i) {
    "use strict";

    if (typeof t.exports == "object") {
      t.exports = e.document ? i(e, true) : function (t) {
        if (!t.document) {
          throw new Error("jQuery requires a window with a document");
        }
        return i(t);
      };
    } else {
      i(e);
    }
  })(typeof window != "undefined" ? window : this, function (n, o) {
```

到这已经很看出来，`i(755)`就是`jQuery`，上面的代码就变成了：

```javascript
$.get("https://api.weibotop.cn/currentitems", function (t) {
  let e = h(t);
  n(e);
});
```

### 解密

再找到函数`h()`：

```javascript
function h(t) {
  i = t = String(t);
  o = n.enc.Base64.parse(i);
  r = a;
  let e = n.AES.decrypt(
    {
      ciphertext: o,
    },
    r,
    {
      mode: n.mode.ECB,
      padding: n.pad.Pkcs7,
    }
  ).toString(n.enc.Utf8);
  var i;
  var o;
  var r;
  return JSON.parse(e);
}
```

从函数`h()`很明显很看出，它使用了[AES 解密](https://zh.wikipedia.org/wiki/%E9%AB%98%E7%BA%A7%E5%8A%A0%E5%AF%86%E6%A0%87%E5%87%86)。关键在于密钥，也就是函数里的`a`。

我们接着看一下`a`是什么：

```javascript
let s = n.SHA1(n.enc.Utf8.parse("tSdGtmwh49BcR1irt18mxG41dGsBuGKS"));
let a = n.enc.Hex.parse(s.toString(n.enc.Hex).substr(0, 32));
```

好了，基本结束了。密钥并没有使用特别恶心的混淆，明文写在了代码里。盲猜`n`就是[crypto-js](https://github.com/brix/crypto-js)，验证一下：

```javascript
var n = i(354);
```

`i(354)` 是：

```javascript
354: function (t, e, i) {
  var n;
  n = i(249);
  i(938);
  i(433);
  i(298);
  // 此处省略一部分无效代码
  t.exports = n;
},
```

这里作者很敷衍的做了点误导，再看一下`i(249)`：

```javascript
249: function (t, e, i) {
  var n;
  t.exports = n = n || function (t, e) {
    var n;
    if (typeof window != "undefined" && window.crypto) {
      n = window.crypto;
    }
    if (!n && typeof window != "undefined" && window.msCrypto) {
      n = window.msCrypto;
    }
    if (!n && i.g !== undefined && i.g.crypto) {
      n = i.g.crypto;
    }
    if (!n) {
      try {
        n = i(Object(function () {
          var t = new Error("Cannot find module 'crypto'");
          t.code = "MODULE_NOT_FOUND";
          throw t;
        }()));
      } catch (t) { }
    }
    function o() {
```

破案，就是`crypto-js`。

### 验证解密

随手写一段代码来验证一下：

```javascript
const Crypto = require("crypto-js");
const cryptedText = "此处贴入/currentitems返回的字符串";

const s = Crypto.SHA1(
  Crypto.enc.Utf8.parse("tSdGtmwh49BcR1irt18mxG41dGsBuGKS")
);
const a = Crypto.enc.Hex.parse(s.toString(Crypto.enc.Hex).substr(0, 32));
const o = Crypto.enc.Base64.parse(cryptedText);
const decryptedText = Crypto.AES.decrypt(
  {
    ciphertext: o,
  },
  a,
  {
    mode: Crypto.mode.ECB,
    padding: Crypto.pad.Pkcs7,
  }
).toString(Crypto.enc.Utf8);

console.log(JSON.parse(decryptedText));
```

正确得到结果：

```javascript
[
  [
    '春晚节目',
    '2024-02-08 22:42:03.0',
    '2024-02-08 07:26:13.0',
    '1243383'
  ],
  [
    '阿根廷3月中国行大概率取消',
    '2024-02-08 21:08:14.0',
    '2024-02-08 12:42:09.0',
    '1183235'
  ],
```

解析格式是：

```javascript
i.push({
  name: e[n][0],
  uptime: e[n][2].replace(/\.0/, ""),
  downtime: e[n][1].replace(/\.0/, ""),
  hotindex: e[n][3],
  duration:
    ((o = e[n][2].replace(/\.0/, "")),
    (r = e[n][1].replace(/\.0/, "")),
    (s = undefined),
    (s = new Date(r.replace(/\s/, "T")) - new Date(o.replace(/\s/, "T"))),
    (s = (s /= 1000).toString()).toHHMMSS()),
  rank: n + 1,
});
```

**getclosesttime**

### 时间戳

再看一下对齐时间。

```javascript
function d(t, i = null) {
  function n(e) {
    var i = {
      timeid: e[0],
      timestamp: e[1],
    };
    t(i);
  }
  if ((i = l(i)) == null) {
    e().getJSON("https://api.weibotop.cn/getlatest", n);
  } else {
    e().getJSON(
      "https://api.weibotop.cn/getclosesttime",
      {
        timestamp: i,
      },
      n
    );
  }
}
```

从这里可以看出，这两个 api 返回的是一个元组`[timeid, timestamp]`。比如`["1151626","2024-05-08 16:32:03.0"]`。

我们接着看函数`l()`：

```javascript
function l(t) {
  if (t == null) {
    return null;
  }
  var e = t;
  var i = a;
  var o = n.AES.encrypt(e, i, {
    mode: n.mode.ECB,
    padding: n.pad.Pkcs7,
  });
  return n.enc.Base64.stringify(o.ciphertext);
}
```

这里也只是将`timestamp`做了个简单的加密，`timestamp`的取值为`w(e()("#selectDateTime").val());`。

`#selectDateTime`是一个类型为[datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local)的输入框，它的`val()`格式是[不带时区的时间字符串](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#local_date_and_time_strings)，比如`2024-05-08T14:27:06`。

### 验证加密

```javascript
const plainText = "2024-05-08T14:27:06";

var o = Crypto.AES.encrypt(plainText, a, {
  mode: Crypto.mode.ECB,
  padding: Crypto.pad.Pkcs7,
});
const encryptedText = Crypto.enc.Base64.stringify(o.ciphertext);

console.log(encryptedText);
console.log(encodeURIComponent(encryptedText));
```

得到结果：

```javascript
lKAKyrL4a6BgfTZtBPfr7sT5QWj+ZtF/nVXIqQgJKw8=
lKAKyrL4a6BgfTZtBPfr7sT5QWj%2BZtF%2FnVXIqQgJKw8%3D
```

与上面的`https://api.weibotop.cn/getclosesttime?timestamp=lKAKyrL4a6BgfTZtBPfr7sT5QWj%2BZtF%2FnVXIqQgJKw8%3D`一致。

`getclosesttime`返回的对齐时间是`["1151567","2024-05-08 14:26:06.0"]`，前面的`1151567`就是`timeid`。

我们将`timeid`进行加密，得到：

```javascript
Jf/nb+7htC8C6fsg3kkuqw==
Jf%2Fnb%2B7htC8C6fsg3kkuqw%3D%3D
```

与上面的`https://api.weibotop.cn/currentitems?timeid=Jf%2Fnb%2B7htC8C6fsg3kkuqw%3D%3D`一致。

至此，破解大体完成。

### 实时热词

顺便，微博似乎开放了热词的 api：https://weibo-info.oss-cn-shenzhen.aliyuncs.com/homekeywords.json。

可直接访问：

```json
[
  "榴莲",
  "淘宝",
  "男子",
  "擦边",
  "绑架勒索",
  "王楚",
  "续命",
  "色弱",
  "苗苗",
  "产子",
  "过万",
  "张本",
  "郑恺",
  "如懿传",
  "蔡少芬",
  "iPad"
]
```

### 作业

这个网站还使用了一个搜索的 api：https://api.weibotop.cn/search?searchstr=m7xb8CtLL8%2BhwqXG8XFAXA%3D%3D。

可以试着破解一下。
