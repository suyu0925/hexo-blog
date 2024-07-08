---
title: web开发中的复制粘贴
date: 2024-07-05 10:30:01
tags:
description: 在web开发中，经常会遇到复制粘贴的需求，这里做一个总结。
hidden: true
---

## 写入剪贴板

写入剪贴板有三种方式：

- 使用[document.execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
- 使用[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- 键盘组合键`Ctrl+C`、`Ctrl+X`

我们一个个来看。

### document.execCommand

`document.execCommand`是一个很古老的 API，目前已经被废弃。虽然大多数浏览器为了兼容老网站还没有移除对它的支持，但绝对不再鼓励使用这个函数，这里只简单介绍一下。

写入剪贴板可使用`copy`和`cut`命令。可以访问这个[example](https://codepen.io/chrisdavidmills/full/gzYjag/)来查看浏览器对命令的支持。

用法是先选中要复制的内容，然后调用`document.execCommand("copy")`或`document.execCommand("cut")`。

```typescript
const inputElement = document.querySelector("#input");
inputElement.select();
document.execCommand("copy");
```

### Clipboard API

使用 Clipboard API 是最推荐的做法，[主流浏览器全部支持这个 API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API#browser_compatibility)。

写入剪贴板（Edge 使用“剪贴板”这个翻译）有两个接口：[writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)和[write](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write)。

其中，`writeText`只能写入 plaintext 文本，而`write`可以写入任意 MIME 类型的数据。

```typescript
await navigator.clipboard.writeText("text/plain abc from clipboard.writeText");
```

```typescript
const generateCanvasBlob = async () => {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "cornflowerblue";
  ctx.fillRect(0, 0, 100, 100);
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas toBlob failed"));
      }
    });
  });
};
const canvasBlob = await generateCanvasBlob();

const clipboardItem = [
  new ClipboardItem({
    ["text/plain"]: new Blob(["text/plain abc from clipboard.write"], {
      type: "text/plain",
    }),
    ["text/html"]: new Blob(["text/html abc from clipboard.write"], {
      type: "text/html",
    }),
    [canvasBlob.type]: canvasBlob,
  }),
];
await navigator.clipboard.write(clipboardItem);
```

除了标准的 MIME 类型数据外，`write`还支持写入[web 自定义格式](https://developer.chrome.com/blog/web-custom-formats-for-the-async-clipboard-api)的数据：
在 MIME 类型前面添加`web `前缀，来避免与标准 MIME 类型冲突。

```typescript
const clipboardItem = [
  new ClipboardItem({
    ["text/plain"]: new Blob(["text/plain abc from clipboard.write"], {
      type: "text/plain",
    }),
    ["text/html"]: new Blob(["text/html abc from clipboard.write"], {
      type: "text/html",
    }),
    ["web text/plain"]: new Blob(["web text/plain abc from clipboard.write"], {
      type: "text/plain",
    }),
  }),
];
await navigator.clipboard.write(clipboardItem);
```

但注意，写入`web自定义格式`需要[请求](https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query)[clipboard-write 权限](https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query#test_support_for_various_permissions)。

```typescript
try {
  // 请求剪贴板读取权限
  const permissionStatus = await navigator.permissions.query({
    name: "clipboard-write",
  });
  if (
    permissionStatus.state === "granted" ||
    permissionStatus.state === "prompt"
  ) {
    await navigator.clipboard.write(clipboardItem);
  }
} catch (error) {
  console.error("Failed to write clipboard:", error);
}
```

### 组合键

组合键的写入权限是最强的，因为这是用户非常明确的操作，用户非常清楚`Ctrl+C`按下去会发生什么。

当用户按下`Ctrl+C`时，浏览器会触发[copy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/copy_event)事件，传入一个[ClipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)。copy 事件会像标准事件一样，[逐步走过捕获、目标、冒泡阶段](https://zh.javascript.info/bubbling-and-capturing)。

`event.clipboardData`是一个[DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer)对象，可以通过[DataTransfer.setData](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData)方法写入数据。

```typescript
document.addEventListener("copy", (event: ClipboardEvent) => {
  const dataTransfer = event.clipboardData!;
  dataTransfer.setData("text/plain", "Hello, world!");
  dataTransfer.setData("text/html", "<b>Hello, world!</b>");
  dataTransfer.setData(
    "application/json",
    JSON.stringify({ message: "Hello, world!" })
  );
  dataTransfer.setData(
    "image/png",
    "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO 9TXL0Y4OHwAAAABJRU5ErkJggg=="
  );
});
```

像之前说的，组合键的功能是最强大的。在 copy 事件处理中，我们除了可以写入[MIME](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)类型的数据外，还可以写入任意自定义格式的数据。

```typescript
document.addEventListener("copy", (event: ClipboardEvent) => {
  const dataTransfer = event.clipboardData!;
  const fragment = "content of a fragment";
  const string = JSON.stringify(fragment);
  const encoded = window.btoa(encodeURIComponent(string));
  dataTransfer.setData("application/x-slate-fragment", encoded);
});
```

## 读取剪贴板

我们分别来看看和写入对应的三种方式：

- 使用[document.execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
- 使用[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- 键盘组合键`Ctrl+V`

### document.execCommand

[document.execCommand](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard)并不能直接读取剪贴板中的内容，使用`paste`可以将剪贴板中的`text/plain`类型数据直接写入到[contenteditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)的 element 中。

但出于安全考虑，目前所有的主流浏览器都会禁止`paste`命令。

可使用[queryCommandSupported](https://developer.mozilla.org/en-US/docs/Web/API/Document/queryCommandSupported)来查看浏览器是否支持`paste`命令。

```typescript
const flg = document.queryCommandSupported("paste");
console.log(`support paste: ${flg}`);
```

### Clipboard API

要使用 Clipboard API 读取剪贴板，一定要先申请[clipboard-read 权限](https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query#test_support_for_various_permissions)。

```typescript
try {
  // 请求剪贴板读取权限
  const permissionStatus = await navigator.permissions.query({
    name: "clipboard-write",
  });
  console.log("permissionStatus.state", permissionStatus.state);
  if (
    permissionStatus.state === "granted" ||
    permissionStatus.state === "prompt"
  ) {
    const clipboardItems = await navigator.clipboard.read();
    const clipboardItem = clipboardItems[0];
    let text = "";
    if (clipboardItem) {
      text += `paste types: ${JSON.stringify(clipboardItem.types)}\n`;
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        if (isFile(blob.type)) {
          text += `paste ${type}: ${blob.name}, ${prettyArray(
            await blob.arrayBuffer()
          )}\n`;
        } else {
          text += `paste ${type}: ${await(blob.text())} \n`;
        }
      }
    }
    console.log(text);
  }
} catch (error) {
  console.error("Failed to write clipboard:", error);
}
```

注意，`clipboard.read`只能读取 MIME 类型以及`web `+ MIME 类型的数据，不能读取自由格式的数据。

### 组合键

当用户按下`Ctrl+V`时，浏览器会触发[paste](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/paste_event)事件，传入一个[ClipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)。

```typescript
document.addEventListener("paste", (event: ClipboardEvent) => {
  const dataTransfer = event.clipboardData;
  let text = "";
  if (dataTransfer) {
    text += `paste types: ${JSON.stringify(data.types)}\n`;
    for (const type of data.types) {
      if (type === "Files") {
        const files = data.files;
        for (let i = 0; i < files.length; i++) {
          const file = files.item(i)!;
          text += `paste file: ${file.name}, ${prettyArray(
            await file.arrayBuffer()
          )}\n`;
        }
      } else {
        text += `paste ${type}: ${data.getData(type)} \n`;
      }
    }
  }
  console.log(text);
});
```

注意，`paste`事件无法读取到`web `+ MIME 类型的数据。
