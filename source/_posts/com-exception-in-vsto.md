---
title: 在vsto中出现COMException
date: 2023-01-16 09:38:42
tags:
- excel-add-in
description: 在excel有后台任务时点击插件上的按钮，出现COMException。
---
## 问题
用户反馈使用excel插件时第一次点击功能区上的按钮会抛出COMException，但第二次就没问题。
会抛出几种COMException：
当使用COM接口的同时，用户正在操作（比如按下鼠标不放选择区域）时：
```
System.Runtime.InteropServices.COMException (0x800AC472): Exception from HRESULT:0x800AC472
  in System.RuntimeType.ForwardCallToInvokeMember(String memberName, BindingFlags flags, Object target, Int32[] aWrapperTypes, MessageData& msgData)
  in Microsoft.office.Interop.Excel.Range.NoteText(Object Text, Object Start, Object Length)
```
Excel忙时：
```
System.Runtime.InteropServices.COMException (0x8001010A): The message filter indicated that the application is busy. (Exception from HRESULT: 0x8001010A (RPC_E_SERVERCALL_RETRYLATER))
  in System.RuntimeType.ForwardCallToInvokeMember(String memberName, BindingFlags flags, Object target, Int32[] aWrapperTypes, MessageData& msgData)
  in Microsoft.Office.Interop.Excel.ListObject.get_HeaderRowRange()
```
当使用COM接口去写入值，而用户又在单元格输入字符进入编辑模式时：
```
System.Runtime.InteropServices.COMException (0x800A03EC): Exception from HRESULT:0x800A03EC
   in System.RuntimeType.ForwardCallToInvokeMember(String memberName, BindingFlags flags, Object target, Int32[] aWrapperTypes, MessageData& msgData)
   in 在 Microsoft.Office.Interop.Excel.Range.set_Value2(Object )
```

## 原因
总的来说，问题出现原因是excel插件使用**后台线程**调用宿主（excel）COM接口时，**宿主正忙**（比如重新计算工作表）导致请求失败。
解决方法有两个：
一是尽量不使用后台线程，全都放在主线程上面做；
二是在后台线程上注册消息过滤器来处理失败请求。

完全不使用后台线程是不现实的，微软有一篇2008年的文章介绍了如何使用消息过滤器：[Implementing IMessageFilter in an Office add-in](https://learn.microsoft.com/en-us/archive/blogs/andreww/implementing-imessagefilter-in-an-office-add-in)。

在微软vsto文档的[Background threads that call into the Office object model](https://learn.microsoft.com/en-us/visualstudio/vsto/threading-support-in-office#background-threads-that-call-into-the-office-object-model)这段，也有提到使用message filter来处理COMExcpetion。

## 复现
想要复现很简单，在调用COM接口之前先Sleep几秒钟，让我们有时间去把宿主变得不可用。正统的办法是执行一个耗资源的宿主任务，比如进行Wind数据更新。但更简便的办法是选中单元格敲个字符进入编辑模式，或者按住鼠标拖个选择框也行。

## 解决
按微软那篇08年的文章里的做法并不能生效诶。试了试微软另一篇文章[How to: Fix 'Application is Busy' and 'Call was Rejected By Callee' Errors](https://learn.microsoft.com/en-us/previous-versions/ms228772(v=vs.140))里的示例，也没用。

stackoverflow上[一篇2018年的贴子](https://stackoverflow.com/questions/51712753/excel-vsto-async-button-strange-behaviour-with-user-interaction)描述了相同的问题，楼主在评论里说他实现了MessageFilter后仍然不能解决COMExcpetion的问题，然后也没了下文。

最终还是只能使用try/catch + retry的方式。
