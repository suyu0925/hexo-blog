---
title: 由用户行为触发的dispatchEvent和由代码触发的区别
date: 2023-12-25 17:50:09
tags:
description: 无意间发现了这么一个区别，就稍微挖了下。
---

## 疑问

首先摆出问题，

```javascript
const btn = document.getElementById("btn");

btn.addEventListener("click", (evt) => {
  Promise.resolve().then(() => console.log("1b"));
  console.log("1a");
});

btn.addEventListener("click", () => {
  Promise.resolve().then(() => console.log("2b"));
  console.log("2a");
});
```

当这个按钮被点击时，控制台会输出什么？直觉会认为监听函数会被同步调用，输出应该是：

```
1a
2a
1b
2b
```

但实际上输出是：

```
1a
1b
2a
2b
```
只有使用`btn.click()`或者`dispathEvent(new Event('click'))`，控制台输出的顺序才会是上面的。

## 原因

这是因为用户点击按钮与dispatchEvent除了[isTrusted](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted)的区别外，还有另一个区别："native" events 是被**异步**调用的，可以参考[mdn 文档](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent)的这一句话：

> Unlike "native" events, which are fired by the browser and invoke event handlers asynchronously via the event loop, dispatchEvent() invokes event handlers synchronously. All applicable event handlers are called and return before dispatchEvent() returns.

为什么会有这样的区别呢？一个通过事件循环变成异步，另一个则是同步。

具体原因在这里，看[clean-up-after-running-script](https://html.spec.whatwg.org/multipage/webappapis.html#clean-up-after-running-script)节的第3点：

> 3. If the JavaScript execution context stack is now empty, perform a microtask checkpoint. (If this runs scripts, these algorithms will be invoked reentrantly.)

"native" events在调用完监听器回调后，会进行clean up，此时会将microtask中的代码运行掉。

而javascript端的dispatchEvent是同步调用的，[btn.click()](https://html.spec.whatwg.org/multipage/interaction.html#dom-click-dev)和`dispathEvent(new Event('click'))`本质上都一样。在stackoverflow找到一个类似提问的[帖子](https://stackoverflow.com/questions/70734518/do-events-bubble-in-microtasks)。

## microtask？

这里提到了microtask，这是什么？

我们可以在[html spec](https://html.spec.whatwg.org/multipage/webappapis.html#microtask-queue)中找到它的介绍，[mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth#tasks_vs_microtasks)上也有。[javascript.info](https://javascript.info/microtask-queue)上也有关于它的描述。

简单来说，它的设计主要是为了在执行完执行栈后、在macrotask之前，做一些清理性的工作。比如Promise、[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)。每一个Promise的回调都会被放到microtask queue中，当当前执行栈为空时，就会可重入的执行microtask queue中的回调。

执行顺序为：
1. execution stack
2. microtask queue
3. macrotask queue
4. before render

在html中，还特别设计了一个[queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)来实现显式的将一个回调放到microtask queue中，用法可以参考[Using microtasks in JavaScript with queueMicrotask()](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)。

## 引申

既然说到了microtask，我们稍微引申一下。

### 对比异步方法

我们列一下在javascript中的几种异步操作方法：
- setTimeout
- setInterval
- async/await
- Promise
- queueMicrotask
- MutationObserver
- requestAnimationFrame

可以将它们分为3类：
1. microtask
  - async/await
  - Promise
  - queueMicrotask
  - MutationObserver
2. macrotask
  - setTimeout
  - setInterval
3. before render
  - requestAnimationFrame

这里要稍微注意一下async函数和返回一个Promise的[区别](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#description)。async/await是Promise的语法糖，我们可以看一下一个简单的async函数用[ts编译后的样子](https://www.typescriptlang.org/play?target=2#code/BQQwzgngdgxsCUACAvAPkQbwFCMQJwFMAXAVzykQEYsBfeBLIA)。

### Node.js

Node.js的[事件循环](https://nodejs.org/en/guides/event-loop-timers-and-nexttick/)与html中有所不同。

它的阶段可概述为：
- timers: this phase executes callbacks scheduled by setTimeout() and setInterval().
- pending callbacks: executes I/O callbacks deferred to the next loop iteration.
- idle, prepare: only used internally.
- poll: retrieve new I/O events; execute I/O related callbacks (almost all with the exception of close callbacks, the ones scheduled by timers, and setImmediate()); node will - block here when appropriate.
- check: setImmediate() callbacks are invoked here.
- close callbacks: some close callbacks, e.g. socket.on('close', ...).

Node.js里有两个html没有的函数：
- [process.nextTick](https://nodejs.org/en/guides/event-loop-timers-and-nexttick/#processnexttick)

  这个函数的目的是为了将同步函数变成异步函数，它没有出现在上面的阶段概述中，而是在每个阶段之间执行，这样可以保证在下一个阶段之前，执行完所有的nextTick回调。

- [setImmediate](https://nodejs.org/en/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout)

  setImmediate与setTimeout很类似，区别在于setImmediate被设计用于在结束当前poll阶段后立即执行一次。

  如果在非I/O循环中调用setImmediate，它与setTimeout(fn, 0)的执行顺序是不确定的，但是在I/O循环中，setImmediate总是在setTimeout之前执行。
