---
title: 记一次简单的数据去重
date: 2019-03-31 04:28:10
description: 记一次简单的数据去重
tags:
- computer science
categories: 
- computer science
---

## 探索数据

拿到数据的第一件事很自然的就是探索，看看数据的组成方式，所包含的信息。

这次拿到的是一份txt和一份csv，存储形式都是类似excel的表格形式。

## 数据清洗

**换行符**

先使用最熟悉的node.js，使用linebylin模块尝试分行读取txt中的数据，结果很出乎意料。读出的数据与txt中显示的不符，似乎一下子就跳到了中间的数据，忽略了最开始的数据。

其实原因很简单，只不过因为缺乏经验而没有第一时间注意到这个问题。

原因是txt的换行符既不是linux下的`\n`，也不是windows下的`\r\n`，而是使用了老mac os的`\r`。这个在notepad中就有显示的信息，居然花了近半个小时才注意到。不得不说灯下黑。

最常使用的[换行符](https://en.wikipedia.org/wiki/Newline#Representation)其实就只有两种，LF(Line Feed, ASCII 10, \n)或者CR-LF（Carriage Return，ASCII 13, \r）。

在node的linebyline模块中，它是这样判断的：
```javascript
    .on('data', function(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i] == 10 || data[i] == 13) { // Newline char was found.
          if (data[i] == 10) {
            lineCount++;
            emit(lineCount, byteCount);
          }
        } else {
          lineBuffer[lineLength] = data[i]; // Buffer new line data.
          lineLength++;
        }
        byteCount++;
      }
    })
```
emit的条件是碰到\n，不管是linux还是windows，这段代码都能正常工作。但如果文件中只有\r，那么很显然会失效。

解决办法是修改linebyline模块，或者使用兼容性更好的readline。

**\x00**

csv格式的文件读取，更习惯用python。

一开始很顺利的读出数据，但却在某一行抛出`_csv.Error: line contains NULL byte`异常。

好在问题很常见，搜索一下就能发现有相当多人遇到同样的问题。

解决方法也很简单，在将数据交给csv reader之前，先过滤掉`NULL byte`。
```javascript
    with open(CSV_FILENAME, 'r', encoding='utf8') as f:
        reader = csv.reader(l.replace('\0', '') for l in f)
```

在检查过程中，还发现存在"\x01"这样的数据，都属于不正常数据，需要修正或剔除。

**数据一致性和完整性**

txt和csv都能正常读取，但数据清洗并没完。还需要检查数据完整性和一致性。

对比发现，csv读取到的条数与文件行数不符。

检查发现原因是存在**不正常换行**，如
```csv
"101","a","0","2019-03-31"
"102","a","0
","2019-03-31"
"103","a","0","2019-03-31"
"104","a","0","2019-03-31"
```

对于这样的数据，可以另外写段脚本进行修正。

## 数据去重

数据读取完成后，开始进行数据去重。

去重的简单思路是先写入数据库，然后通过数据库命令进行去重。

数据去重在逻辑上无非两部分，一是判断是否重复，二是去除。

**mongodb**
如使用mongodb，有两种方法：
1. 使用aggregate聚合
```
var duplicates = [];

db.collectionName.aggregate([
  {
    $match: {
      name: { "$ne": '' }  // discard selection criteria
    }
  },
  {
    $group: {
      _id: { name: "$name" }, // can be grouped on multiple properties 
      dups: { "$addToSet": "$_id" },
      count: { "$sum": 1 }
    }
  },
  {
    $match: {
      count: { "$gt": 1 }    // Duplicates considered as count greater than one
    }
  }
],
  { allowDiskUse: true }       // For faster processing if set is larger
)               // You can display result until this and check duplicates 
  .forEach(function (doc) {
    doc.dups.shift();      // First element skipped for deleting
    doc.dups.forEach(function (dupId) {
      duplicates.push(dupId);   // Getting all duplicate ids
    }
    )
  })

// If you want to Check all "_id" which you are deleting else print statement not needed
printjson(duplicates);

// Remove all duplicates in one go
db.collectionName.remove({ _id: { $in: duplicates } })
```

2. 使用mapreduce
```javascript
  const o = {}
  o.map = function () {
    emit(this.phone, 1)
  }
  o.reduce = function(k, vals) {
    return Array.sum(vals)
  }
  o.out = {
    replace: 'mapreduce_demo'
  }
  const result = await Item.mapReduce(o)
```
mapreduce完成后，在生成的新的collection是搜索出现次数超过1次的，再保留第一个，删除其它。

**mysql**
如使用mysql，也有两种方式，具体请参考[这篇文章](http://www.mysqltutorial.org/mysql-delete-duplicate-rows/)

1. 使用`DELETE JOIN`

2. 使用中间数据库

## 超大数据

使用数据来进行去重操作似乎是个常规选项，但当遇上超大数据时，就显得有点为了吃匹萨自己做个烤箱了。

1. 首先是内存问题

如果是node，可以使用这样的命令来启动：
```bash
node --max-old-space-size=8192 app.js
```

如果是mongodb，可以加上使用硬盘缓冲的选项：
```javascript
  const result = await model.aggregate([{
    $group: {
      _id: { id: '$_id' },
      count: { '$sum': 1 }
    }
  }]).allowDiskUse(true)
```

2. 其次是速度

如果数据量过千万，即使是一个简单的分组查询动作，也要几十分钟才能完成。

## 结局

最终，写了个简单的脚本，一边从源文件读取并加工数据，另一边输出到目标文件，放弃使用数据库。

简单的一个去重数据操作，最终花耗了超过4个小时的时间。

虽然曾经上过Udacity的数据分析纳米课程，但一旦真正上手，还是问题不断，感叹学海无涯。

## 结语

数据去重这步操作最好还是在入库前做，是将一个耗时巨长的操作分散在每一时刻，还是忙时尽量快，闲时再做长时间操作。

或者再多思考下到底是出于什么目的进行数据去重。有索引的帮助，查询其实很快。
