---
title: "WIP: web开发中的复制粘贴"
date: 2024-07-05 10:30:01
tags:
description: 在web开发中，经常会遇到复制粘贴的需求，这里做一个总结。
hidden: true
---
## 用户操作方式

用户操作方式可以分成两种，一种是通过组合键`Ctrl+C`、`Ctrl+X`和`Ctrl+V`，另一种是通过其他方式。

## 通过组合键

当用户在一个编辑框中按下`Ctrl+C`时，浏览器会触发[copy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/copy_event)事件，传入一个[ClipboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent)。

相应的，还有[cut](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/cut_event)和[paste](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/paste_event)事件。

```typescript
document.addEventListener('copy', (event: ClipboardEvent) => {
  console.log('copy', event.clipboardData.getData('text/plain'));
});
```
