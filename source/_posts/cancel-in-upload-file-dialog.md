---
title: 在对html中文件上传对话框中点取消的处理
date: 2023-03-02 09:09:19
tags:
description: 在开发文件上传控件时，发现在edge中取消文件上传对话框后会移除已选择的文件，稍微挖一下。
---
## 问题
首先，我们先添加一个[文件上传控件](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)：
```html
<input type="file" />
```

然后点击`Choose File`（在firefox中是Browse...），弹出文件对话框后，先随便选择一个文件，选`打开`。

再次点击`Choose File`，弹出文件对话框后，这次不选择文件，直接选`取消`。

如果你使用的浏览器也是edge，你会发现刚才选择的文件被移除了。

这会让人有点疑惑，毕竟像我这样手欠的人还挺多，取消选择后会移除已选择的文件，感觉还挺奇怪的。

## 不同浏览器
抱着试试看的想法，用chrome试了下。发现结果一样。

再拿firefox试了下，咦？咦！怎么表现不一样？并不会移除已选择的文件。以前都没发现过还有这种区别。

## 原因
稍微做了下搜索。找到两个对立的issue。

一个是chromium社区2008年提出的[issue](https://bugs.chromium.org/p/chromium/issues/detail?id=2508)，要求取消文件选择对话框后不要清除文件；
一个是firefox社区同样也是2008年提出的[issue](https://bugzilla.mozilla.org/show_bug.cgi?id=431098)，要求增加清除文件的方法：比如取消文件选择对话框。

还真是……围城是吧。

两边社区的维护者也都有很好的理由：
- 赞成移除派(blink/webkit)
如果用户想移除已经选择的文件，弹出对话框后点取消，这是唯一的途径；
- 反对移除派(gecko)
取消是空操作，不应该强加于用户。

最终，两边的维护者都维持原状。

## 统一体验

对开发者来说，最好能够统一使用不同浏览器的用户体验。我倾向于统一成firefox的做法，因为想要移除已选择的文件，我们简单的加一个叉叉图标就解决了。

想要hack掉edge中取消文件对话框移除已选择文件的做法，我们可以这样做：
1. 在用户打开文件对话框时，克隆input控件；
2. 在用户关闭文件对话框时，判断用户是否选择了取消，如果是，恢复input控件。

代码片段：
```html
<input type="file" onchange="changeFile(event)" onclick="clickFile(event)" id="file" />
<input type="button" onclick="removeFile()" value="remove" />

<script>
    var clone = {}

    function changeFile(event) {
        var fileElement = event.target;
        console.log("file changed: ", fileElement.value)
        if (fileElement.value == "") {
            fileElement.parentNode.insertBefore(clone[fileElement.id], fileElement.nextSibling)
            fileElement.parentNode.removeChild(fileElement); //removing parent 
        }
    }

    function clickFile(event) {
        console.log("click event is fired")
        var fileElement = event.target;
        if (fileElement.value != "") {
            clone[fileElement.id] = fileElement.cloneNode(true); //cpoying clone
        }
    }

    function removeFile() {
        document.getElementById("file").value = "";
    }
</script>
```
