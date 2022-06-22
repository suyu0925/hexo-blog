---
title: 使用日本代理后谷歌搜索结果一堆日文
date: 2022-06-21 16:33:19
description: 除了使用英文国家的代理，我们还可能使用日本韩国等非英语国家，这时谷歌的搜索结果就很难看了。
tags:
---
除了使用英文国家的代理，我们还可能使用日本韩国等非英语国家，这时谷歌的搜索结果就很难看了，搜索结果里会有一堆看不懂的非英文的内容。

网上说的什么使用[香港谷歌](https://google.com.hk)，使用[无国家跳转谷歌](https://google.com/ncr)呀的方法都无效。

这里提供两个思路：

## 在浏览器中给谷歌开放位置权限

浏览器默认是不给谷歌开放位置权限的，

{% asset_img "site-permissions.png" "site-permissions" %}

所以谷歌只能根据IP来判断用户所在地区，

{% asset_img "google-japan.png" "google-japan" %}

对搜索结果也就会有影响。

{% asset_img "google-result-japan.png" "google-result-japan" %}

所以我们可以赋予谷歌位置权限，让它能正确的识别出我们所使用的语言。

{% asset_img "allow-location.png" "allow-location" %}

## 使用搜索参数

在谷歌的[Programmable Search Engine文档](https://developers.google.com/custom-search/docs/xml_results#request-parameters)中有提供相应的参数。

影响搜索结果的显示语言的参数是[**hl**](https://developers.google.com/custom-search/docs/xml_results#interface-languages)，我们可以在[这里](https://developers.google.com/custom-search/docs/xml_results_appendices#interfaceLanguages)找到可用的值。

另一个和语言有关的参数是[**lr**](https://developers.google.com/custom-search/docs/xml_results#searching-for-documents-written-in-specific-languages)，如果指定参数，它会过滤网页内容使用的语言。在[这里](https://developers.google.com/custom-search/docs/xml_results_appendices#language-collection-values)可以找到可用的值。比如搜索简体和繁体中文的网页内容，可以使用`https://google.com/search?hl=zh-CN&lr=lang_zh-TW|lang_zh-CN&c2coff=0`。

综上，我们只需要将搜索引擎的页面改为`https://google.com?hl=zh-CN`，不管使用的代理IP是哪个国家，搜索结果都不会太受影响。
