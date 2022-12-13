---
title: react 18中的严格模式
date: 2022-12-13 10:12:19
tags:
description: 最近的项目中使用了react 18，在开发中发现useEffect会被运行两次……
---
## 问题
最近的项目中使用了react 18，下面的代码在code发生变化时会请求两次：
```typescript
const { code } = useParams()
useEffect(() => {
  authByCode(code)
}, [code])
```
这里的`authByCode`每个`code`只能使用一次，第二次使用的时候会报错，所以才发现了会运行两次的问题。

## 前因后果
网上搜了下，发现react官方早有文档说明了这种情况，甚至还分为了[useMemo](https://beta.reactjs.org/apis/react/useMemo#my-calculation-runs-twice-on-every-re-render)和[useEffect](https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)分别介绍。

出现运行两次的原因是React 18有一个[Breaking Change](https://github.com/facebook/react/blob/main/CHANGELOG.md#react-1)：使组件在卸载后保留状态，这样当组件重新挂载回时可以更快速的响应。

为了测试保留状态是否能正常工作，又可以更好的[保持组件纯净](https://beta.reactjs.org/learn/keeping-components-pure)，React 18在开发时打开[严格模式](https://reactjs.org/docs/strict-mode.html)后，组件在加载时，会改为[加载-卸载-重新加载](https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state)。

## 解决
回到最开始的问题，官方建议的[给网络请求加上cleanup](https://beta.reactjs.org/learn/synchronizing-with-effects#fetching-data)的方法其实是没用的。我们的问题是发生在服务端而不是客户端。

这里可以听取[react维护者的建议](https://github.com/facebook/react/issues/24502#issuecomment-1118867879)，使用客户端缓存，比如[react-query](https://github.com/facebook/react/issues/24502#issuecomment-1120856043)。
