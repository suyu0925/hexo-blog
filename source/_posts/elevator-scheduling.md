---
title: 电梯调度
date: 2024-04-12 13:04:05
tags:
description: 每次久等电梯不来，都会骂一通电梯调度算法，那么真的如果让我们来设计一套算法会是怎么样的呢？
---

电梯调度在现实中是很复杂的，并不是一个简单的算法就能解决。它还需要考虑：满载、多梯联动、取消目的地、高峰期、上梯前输入目的地等等因素。

## 最简单的电梯调度算法

我们先从单梯且无满载和取消目的地的简单情况上手。

在去除所有复杂因素后，电梯调度会与磁盘调度算法有一些相似。磁头的移动就像电梯的上下，磁盘的读写就像乘客的上下。磁盘调度就是要尽可能减少磁头的移动，提高读写效率。

比如磁盘调度的[SCAN 算法](https://www.geeksforgeeks.org/scan-elevator-disk-scheduling-algorithms/)就又称为电梯算法：

电梯从最低楼层到最高楼层，然后再从最高楼层到最低楼层，如此循环。有点类似公交车或地铁，并不知道有没有人要上车，只是按照固定的路线行驶。

电梯和磁头的运动在反向运动时有一个减速再加速的过程，会严重影响效率，所以要尽可能减少反向运动。

这种电梯调度算法只是用来当作引子，并没有实际应用价值。

## 先来先服务

但电梯调度算法是知道哪一层有人要上下的：

- 在电梯外往上往下的按钮代表要上电梯
- 在电梯内按具体楼层按钮代表要在哪一层下
- 一些新电梯调度系统可以允许乘客在电梯外输入目的地

我们把乘客记为 G，电梯记为 E()，乘客要从第 i 层到第 j 层记为 i -> j，那我们可以用一个队列来表示，比如：

```
E(): 1
G1: 1 -> 5
G2: 2 -> 3
G3: 4 -> 6
```

电梯先去 1 层接到乘客 G1，然后到 5 层；再去 2 层接乘客 G2，然后到 3 层；最后去 4 层接乘客 G3，然后到 6 层。

```
E(): 1  |  ↑ G1
E(G1): 1 -> 5 | G1 ↓
E(): 5 -> 2 |  ↑ G2
E(G2): 2 -> 3 | G2 ↓
E(): 3 -> 4 | ↑ G3
E(G3): 4 -> 6 | G3 ↓
```

这种算法同样会浪费大量运力，比如在送乘客 G1 的过程中，完全可以把乘客 G2 也顺路接上，在到达 5 层之前，在 3 层把乘客 G2 先放下。

## 最短路径优先

那我们换一种思路，以电梯外乘客的起点，以及电梯内乘客的终点为节点，判断电梯距离哪个节点最近，就先去哪个节点，还是用上面的例子：

```
E(): 1
G1: 1 -> 5
G2: 2 -> 3
G3: 4 -> 6
```

```
E(): 1  |  ↑ G1
E(G1): 1 -> 2 | ↑ G2
E(G1, G2): 2 -> 3 | G2 ↓
E(G1): 3 -> 4 | ↑ G3
E(G1, G3): 3 -> 5 | G1 ↓
E(G3): 5 -> 6 | G3 ↓
E(): 6
```

粗看是不是觉得这种算法还挺好，那我们再来一个例子：

```
E(): 1
G1: 5 -> 1
G2: 4 -> 5，G4: 1 -> 5
G3: 3 -> 4
```

如果按照最短路径优先，那么电梯会这样运行：

```
E(): 1 -> 5  |  ↑ G1
E(G1): 5 -> 4 | ↑ G2
E(G1, G2): 4 -> 5 | G2 ↓ // 注意，这里相比G1的目的地1层，电梯离G2的目的地5层更近
E(G1): 5 -> 3 | ↑ G3
E(G1, G3): 3 -> 4 | G3 ↓ // 注意，这里相比G1的目的地1层，电梯离G3的目的地4层更近
E(G1): 4 -> 1 | G1 ↓, ↑ G4
E(G4): 1 -> 5 | G4 ↓
```

如果我们是乘客 G4，肯定已经开骂了。因为只要不断有人要上下电梯附近的楼层，那么电梯将永远不会去到更远的楼层。

乘客 G1 也会开骂，我只是想从 5 层到 1 层，为什么要带着我在电梯上一直绕，能不能让我下电梯我走楼梯去 1 层？

## 三合一：LOOK 算法

上面三种算法都有各自的优缺点，那么我们能不能把它们结合起来呢？当然可以，[LOOK 算法](https://www.geeksforgeeks.org/look-disk-scheduling-algorithm/)就是这样一个算法。

相当于：顺向接反向不接 + 先来先服务 + 最短路径优先。

我们再看一下上面的例子：

```
E(): 1
G1: 5 -> 1
G2: 4 -> 5，G4: 1 -> 5
G3: 3 -> 4
```

```
E(): 1 -> 5  |  ↑ G1
E(G1): 5 -> 1 | G1 ↓, ↑ G4
E(G4): 1 -> 3 | ↑ G3
E(G4, G3): 3 -> 4 | G3 ↓
E(G3): 4 -> 5 | G4 ↓
```

是不是已经很像我们日常乘坐电梯的体验了？

但日常电梯几乎不太可能是单梯，我们扩展到多梯。

## 多梯

多梯与单梯的最显著的区别是多梯可以联动，遵循顺向接反向不接、就近接人的原则。

依然以上面的例子为为例，但这次我们有两台电梯。

我们再看一下上面的例子：

```
E1(): 1
E2(): 1
G1: 5 -> 1
G2: 4 -> 5，G4: 1 -> 5
G3: 3 -> 4
```

```
E1(): 1 -> 5  |  ↑ G1
E2(): 1 | ↑ G4
E1(): 5 -> 3 | ↑ G3
E2(G4): 1 -> 4 | ↑ G2
E1(G3): 3 -> 4 | G3 ↓
E2(G4, G2): 4 -> 5 | G2 ↓
E2(G4): 5 | G4 ↓
```

## 实际工程

实际工程要比上面的例子复杂得多，需要结合场景来调整电梯调度算法。可以大概浏览一下专门研究电梯调度的公司[Peters Research](https://peters-research.com/)发的一些[研究论文](https://peters-research.com/index.php/papers/)，看看目前的研究方向。

### 电梯台数

设计师会根据建筑的高度、人流量、电梯的速度、用途等因素来预估需要的电梯台数。比如五星级酒店考虑的就是如何让客人在一分钟内坐到电梯。

而国家在[《民用建筑设计统一标准》](https://www.mohurd.gov.cn/gongkai/zhengce/zhengcefilelib/201905/20190530_240715.html)的`6.9 电梯、自动拊梯和自动人行道`章节中也有最低电梯台数的规定。

### 待机楼层

在闲时，电梯并不会原地待机，会停在1层和中间楼层，以便更快地接到高层乘客。

### 分区电梯

在高层建筑中，电梯需要一个很高加速度来到达极速，但又要考虑频繁加减速对人的影响。

所以在高层建筑中电梯都会分区，比如 1-20 层是一个区，21-40 层是一个区，41-60 层是一个区。电梯会以一个相对高的速度直接上到 41 层，然后再以一个正常的速度在 41-60 层运行。

### 预测人流动线

电梯在不同时间段的人流动线是不一样的。比如早上上班时间，电梯会有很多人要去上班，那么电梯就要提前到达高峰楼层等待。

### 取消目的地

有时候乘客会在电梯内变更目的地，这时候电梯就要重新调度。

### 电梯外输入目的地

相比电梯外只能确定乘客乘坐方向，在电梯外直接输入目的地可以有效的增加调度效率，无需接到乘客后才能在电梯内确定具体目的地，还能知道正在电梯外等待的具体人数。

### AI

使用 AI 来实现电梯集群的调度会是下一代电梯调度的方向。

比如使用强化学习的[Elevator Control Using Reinforcement Learning to Select Strategy](https://www.diva-portal.org/smash/get/diva2:811308/FULLTEXT01.pdf)。

[Transformer Networks for Predictive Group Elevator Control](https://arxiv.org/abs/2208.08948)甚至已经用上了 transformer 网络。

## 附录：

分析电梯使用情况用到的参数

- AI(INT): 平均运行间隔时间
- AWT: 平均等候时间
- AJT: 平均旅行时间
- ATTD: 用户从进入电梯厅到完全到达目的楼层的时间
- HC5: 5 分钟运载能力
- CC: 轿厢负载率
