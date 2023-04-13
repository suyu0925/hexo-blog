---
title: Redis Stream
date: 2023-04-13 11:02:36
tags:
- redis
description: Redis 5.0引入了Stream，解决了Pub/Sub的持久化问题。
---
Redis支持[Pub/Sub](https://redis.io/docs/manual/pubsub/)，但如果发布消息时订阅者没上线，那信息就会丢失。Redis在5.0中引入了[Stream](https://redis.io/docs/data-types/streams/)，提供了消息的持久化和主备复制功能，可以让任何客户端访问任何时刻的数据，并且能记住每一个客户端的访问位置，还能保证消息不丢失。

Stream在Redis中是一种数据结构，可以简单的理解为一个消息链表。

## 消息(Entry)

每条消息除了内容外，都有一个唯一的ID。格式为`{Unix毫秒时间戳}-{序号}`，比如`1681365707499-0`。

### 创建
使用[XADD](https://redis.io/commands/xadd/)命令向Stream追加一条消息。
```redis-cli
redis> XADD persons * name Jim surname Green
"1681365707499-0"
```
`*`代表用户不指定，由redis来生成ID。

如果目标Stream不存在，会创建一个新的Stream。
```redis-cli
redis> KEYS *
 1) "persons"
redis> TYPE persons
stream
```

### 读取
使用[XREAD](https://redis.io/commands/xread/)来读取消息。
```redis-cli
redis> XREAD STREAMS persons 0
1) 1) "persons"
   2) 1) 1) "1681365707499-0"
         2) 1) "name"
            2) "Jim"
            3) "surname"
            4) "Green"
```
XREAD可以指定返回的消息条数，以及消息起始ID。
再添加三条数据：
```redis-cli
redis> XADD persons * name Geoffrey surname Hinton
"1681365756516-0"
redis> XADD persons * name Yann surname LeCun
"1681365759975-0"
redis> XADD persons * name Andrew surname Ng
"1681365768735-0"
```
然后可以这样读取：
```redis-cli
redis> XREAD COUNT 2 STREAMS persons 1681365707499-0
1) 1) "persons"
   2) 1) 1) "1681365756516-0"
         2) 1) "name"
            2) "Geoffrey"
            3) "surname"
            4) "Hinton"
      2) 1) "1681365759975-0"
         2) 1) "name"
            2) "Yann"
            3) "surname"
            4) "LeCun"
```
`COUNT 2`代表最多返回2条消息，最后的`1681365707499-0`代表从这条消息后（不含这条消息）开始读取。

除了`XREAD`外，还有[XRANGE](https://redis.io/commands/xrange/)和[XREVRANGE](https://redis.io/commands/xrevrange/)可以读取消息。

### 查看Stream信息
创建后可使用[XINFO STREAM](https://redis.io/commands/xinfo-stream/)查看Stream的信息。
```redis-cli
redis> XINFO STREAM persons
 1) "length"
 2) (integer) 4
 3) "radix-tree-keys"
 4) (integer) 1
 5) "radix-tree-nodes"
 6) (integer) 2
 7) "last-generated-id"
 8) "1681365768735-0"
 9) "groups"
10) (integer) 0
11) "first-entry"
12) 1) "1681365707499-0"
    2) 1) "name"
       2) "Jim"
       3) "surname"
       4) "Green"
13) "last-entry"
14) 1) "1681365768735-0"
    2) 1) "name"
       2) "Andrew"
       3) "surname"
       4) "Ng"
```

### 消息修剪
如果堆积的消息过多，会造成内存浪费，我们有两种方式来修剪。

1. 在添加时指定最大消息条数

先添加一些测试数据。
```redis-cli
redis> XADD tempstream * message "hello, 1"
"1681369081881-0"
redis> XADD tempstream * message "hello, 2"
"1681369084603-0"
redis> XADD tempstream * message "hello, 3"
"1681369086480-0"
redis> XLEN tempstream
(integer) 3
```

在添加时指定最大消息条数。
```redis-cli
redis> XADD tempstream MAXLEN 3 * message "hello, 4"
"1681369112438-0"
redis> XREAD STREAMS tempstream 0
1) 1) "tempstream"
   2) 1) 1) "1681369084603-0"
         2) 1) "message"
            2) "hello, 2"
      2) 1) "1681369086480-0"
         2) 1) "message"
            2) "hello, 3"
      3) 1) "1681369112438-0"
         2) 1) "message"
            2) "hello, 4"
```
因为指定了最多保留3条消息，所以最老的第1条消息被修剪。

2. 使用[XTRIM](https://redis.io/commands/xtrim/)修剪

```redis-cli
redis> XADD tempstream * message "hello, 5"
"1681369225281-0"
redis> XLEN tempstream
(integer) 4
redis> XTRIM tempstream MINID 1681369086480
(integer) 1
redis> XREAD STREAMS tempstream 0
1) 1) "tempstream"
   2) 1) 1) "1681369086480-0"
         2) 1) "message"
            2) "hello, 3"
      2) 1) "1681369112438-0"
         2) 1) "message"
            2) "hello, 4"
      3) 1) "1681369225281-0"
         2) 1) "message"
            2) "hello, 5"
```
指定了`MINID`后，在这条消息之前的消息全部会被修剪。

同时，`XTRIM`也可以使用`MAXLEN`。
```redis-cli
redis> XTRIM tempstream MAXLEN ~ 2
(integer) 1
redis> XREAD STREAMS tempstream 0
1) 1) "tempstream"
   2) 1) 1) "1681369086480-0"
         2) 1) "message"
            2) "hello, 3"
      2) 1) "1681369112438-0"
         2) 1) "message"
            2) "hello, 4"
      3) 1) "1681369225281-0"
         2) 1) "message"
            2) "hello, 5"
```
注意那个`~`号，它会采用更高效的算法来决定修剪多少条，在这里它觉得当前条数已经足够少决定不执行修剪。

## 消费者(Consumer)与消费者组(Consumer Group)

消费者组主要包含一个`last_delivered_id`，记录了最后一次成功消费的消息ID，用于跟踪消费者组在流中的进度。

### 创建
消费者组可使用[XGROUP CREATE](https://redis.io/commands/xgroup-create/)命令创建。
```redis-cli
redis> XGROUP CREATE persons mygroup 0
OK
```

可以使用[XINFO GROUPS](https://redis.io/commands/xinfo-groups/)查看Stream下的消费者组。
```redis-cli
redis> XINFO GROUPS persons
1) 1) "name"
   2) "mygroup"
   3) "consumers"
   4) (integer) 0
   5) "pending"
   6) (integer) 0
   7) "last-delivered-id"
   8) "0-0"
```

在创建消费者组时可以指定`last-delivered-id`，当然也可以创建完再使用[XGROUP SETID](https://redis.io/commands/xgroup-setid/)修改，效果一样。
```redis-cli
redis> XGROUP CREATE persons tempgroup 1681365756516-0
OK
redis> XINFO GROUPS persons
1) ...
2) 1) "name"
   2) "tempgroup"
   3) "consumers"
   4) (integer) 0
   5) "pending"
   6) (integer) 0
   7) "last-delivered-id"
   8) "1681365756516-0"
redis> XGROUP SETID persons tempgroup 1681365759975-0
OK
redis> XINFO GROUPS persons
1) ...
2) 1) "name"
   2) "tempgroup"
   3) "consumers"
   4) (integer) 0
   5) "pending"
   6) (integer) 0
   7) "last-delivered-id"
   8) "1681365759975-0"
redis> XGROUP DESTROY persons tempgroup
(integer) 1
```

### 通过消费者读取消息
通过消费者组来读取消息需要改用[XREADGROUP](https://redis.io/commands/xreadgroup/)命令。
```redis-cli
redis> XREADGROUP GROUP mygroup myconsumer COUNT 2 STREAMS persons >
1) 1) "persons"
   2) 1) 1) "1681365707499-0"
         2) 1) "name"
            2) "Jim"
            3) "surname"
            4) "Green"
      2) 1) "1681365756516-0"
         2) 1) "name"
            2) "Geoffrey"
            3) "surname"
            4) "Hinton"
```
在这里我们使用了消费者`myconsumer`，`XREADGROUP`必须指定消费者组以及消费者。如果消费者不存在则会创建。
在读取完2条消息后，`mygroup`的`last-delivered-id`发生了变化：
```redis-cli
redis> XINFO GROUPS persons
1) 1) "name"
   2) "mygroup"
   3) "consumers"
   4) (integer) 1
   5) "pending"
   6) (integer) 2
   7) "last-delivered-id"
   8) "1681365756516-0"
```
同时，`consumers`从0变成了1。一个新的消费者`myconsumer`被创建。我们可以用[XINFO CONSUMERS](https://redis.io/commands/xinfo-consumers/)来查看。
```redis-cli
redis> XINFO CONSUMERS persons mygroup
1) 1) "name"
   2) "myconsumer"
   3) "pending"
   4) (integer) 2
   5) "idle"
   6) (integer) 248693
```
我们可以注意到，`mygroup`的`pending`从0变成了2，`myconsumer`的`pending`也等于2。

### 挂起(pending)
`pending`代表未被处理的消息。
在上面的操作中，我们分配给了消费者`myconsumer`2条消息，`myconsumer`在处理完后，需要标记这2条消息为确认完成或拒绝完成，这样才能保证消息不丢失。

可以使用[XPENDING](https://redis.io/commands/xpending/)命令来查看消费者组里挂起的消息。
```redis-cli
redis> XPENDING persons mygroup
1) (integer) 2
2) "1681365707499-0"
3) "1681365756516-0"
4) 1) 1) "myconsumer"
      2) "2"
```

可以使用[XACK](https://redis.io/commands/xack/)命令来确认消息处理完毕。被确认的消息会从待确认条目列表（Pending Entries List (PEL)）中移去。
```redis-cli
redis> XACK persons mygroup 1681365707499-0
(integer) 1
redis> XPENDING persons mygroup
1) (integer) 1
2) "1681365756516-0"
3) "1681365756516-0"
4) 1) 1) "myconsumer"
      2) "1"
redis> XINFO CONSUMERS persons mygroup
1) 1) "name"
   2) "myconsumer"
   3) "pending"
   4) (integer) 1
   5) "idle"
   6) (integer) 1251414
```

我们再创建一个消费者，给它也分配2条消息看看。
```redis-cli
redis> XGROUP CREATECONSUMER persons mygroup betterconsumer
(integer) 1
redis> XREADGROUP GROUP mygroup betterconsumer COUNT 2 STREAMS persons >
1) 1) "persons"
   2) 1) 1) "1681365759975-0"
         2) 1) "name"
            2) "Yann"
            3) "surname"
            4) "LeCun"
      2) 1) "1681365768735-0"
         2) 1) "name"
            2) "Andrew"
            3) "surname"
            4) "Ng"
redis> XPENDING persons mygroup
1) (integer) 3
2) "1681365756516-0"
3) "1681365768735-0"
4) 1) 1) "betterconsumer"
      2) "2"
   2) 1) "myconsumer"
      2) "1"
```

标记`1681365759975-0`完成。
```redis-cli
redis> XACK persons mygroup 1681365759975-0
(integer) 1
redis> XPENDING persons mygroup - + 10
1) 1) "1681365756516-0"
   2) "myconsumer"
   3) (integer) 2954839
   4) (integer) 1
2) 1) "1681365768735-0"
   2) "betterconsumer"
   3) (integer) 572468
   4) (integer) 1
```
`2954839`和`572468`代表消费者已经消耗的时间。

### 超时处理

使用[XCLAIM](https://redis.io/commands/xclaim/)命令将超时的消息换人处理。
```redis-cli
redis> XCLAIM persons mygroup betterconsumer 60000 1681365756516-0
1) 1) "1681365756516-0"
   2) 1) "name"
      2) "Geoffrey"
      3) "surname"
      4) "Hinton"
redis> XPENDING persons mygroup
1) (integer) 2
2) "1681365756516-0"
3) "1681365768735-0"
4) 1) 1) "betterconsumer"
      2) "2"
```

也可使用[XAUTOCLAIM](https://redis.io/commands/xautoclaim/)来指定一个托底的消费者。
