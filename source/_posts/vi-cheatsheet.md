---
title: vi命令速查表
date: 2024-03-18 19:38:36
tags:
description: vi是一款非常强大的文本编辑器，但是它的操作方式有些特殊，不太容易上手。这里整理了一些常用的vi命令，方便查阅。
---
vi有三种模式：命令模式、插入模式和底行模式。默认是命令模式，按`i`或`o`进入插入模式，按`:`进入底行模式。

## 移动光标

- `h` 左移一个字符
- `j` 下移一行
- `k` 上移一行
- `l` 右移一个字符
- `0` 移动到行首
- `$` 移动到行尾
- `w` 移动到下一个单词的开头
- `b` 移动到上一个单词的开头
- `gg` 移动到文件开头
- `G` 移动到文件末尾
- `(` 移动到上一个句子
- `)` 移动到下一个句子
- `{` 移动到上一个段落
- `}` 移动到下一个段落
- `H` 移动到屏幕顶部
- `M` 移动到屏幕中间
- `L` 移动到屏幕底部
- `:${n}` 移动到第n行
- ``` `` ```或者`''` 移动到上次编辑的位置

## 搜索

- `/` 向前重复搜索
- `?` 向后重复搜索
- `/regex` 向前搜索正则
- `? regex` 向后搜索正则
- `n` 重复上一搜索，搜索方向相同
- `N` 重复上一搜索，搜索方向相反

## 插入

- `i` 在光标前插入
- `I` 在行首插入
- `a` 在光标后插入
- `A` 在行尾插入
- `o` 在下一行插入
- `O` 在上一行插入

## 删除

- `x` 删除光标处字符
- `X` 删除光标前字符
- `dd` 删除当前行
- `d$` 删除光标到行尾
- `d0` 删除光标到行首
- `${n}d` 删除第n行