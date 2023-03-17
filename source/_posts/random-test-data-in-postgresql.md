---
title: 在postgresql中生成测试数据
date: 2023-03-17 15:11:07
tags:
- sql
description: 经常会需要大批量的随机数据用来测试，这里记录一些生成方法。
---
## 内建函数
首先我们需要一些内建函数来产生不会重复的数据。

### random
第一个进入我们视野的应该就是[random()](https://www.postgresql.org/docs/current/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE)函数了。

random()函数会返回一个`[0, 1)`的高精度随机数，我们可以用这个随机数来生成各种类型的数据。

整数
```sql
-- 大于等于0，小于100的整数
SELECT (random() * 100)::int;
-- 16
```

小数
```sql
SELECT (random() * 100.)::numeric(4, 2);
-- 56.31
```

字符
```sql
SELECT chr(int4(random() * 26) + 65);
-- E
```

字符串
```sql
-- 直接转换为字符串
SELECT 'id-' || random()::text;
-- id-0.529535423895549

-- 4位字母字符串
SELECT repeat(chr(int4(random() * 26) + 65), 4);
-- SSSS

-- 使用md5转成32位字符串
SELECT md5(random()::text);
-- 508f0bdea8e3260b72f43db9e2477b0d
```

日期
```sql
SELECT to_timestamp(EXTRACT(EPOCH FROM now()) + random() * 24 * 60 * 60) at time zone 'CCT';
-- 2023-03-17 22:07:12.593732

SELECT CURRENT_DATE - (random() * 365)::int * INTERVAL '1 DAY';
-- 2022-05-30 00:00:00
```

### uuid
可以使用[pgcrypto](https://www.postgresql.org/docs/current/pgcrypto.html)模块中的[gen_random_uuid()](https://www.postgresql.org/docs/current/pgcrypto.html#id-1.11.7.37.11)函数来生成一个version4的uuid。

而在Postgresql 13之后，不需要引入pgcrypto，可以直接使用[gen_random_uuid()](https://www.postgresql.org/docs/current/functions-uuid.html)。

```sql
-- 启用pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

SELECT gen_random_uuid();
-- d4618c5d-9b00-4856-bbab-35e266dcb80b
```

### 生成序列
[generate_series](https://www.postgresql.org/docs/current/functions-srf.html)函数可以用来生成序列。

```sql
SELECT *
FROM generate_series(1, 10, 2)
-- 1
-- 3
-- 5
-- 7
-- 9
``` 

## 插入数据
有了上面这些内建函数，我们就可以很方便的插入测试数据了。

先创建一个测试表。
```sql
CREATE TABLE IF NOT EXISTS user_for_test(
  username text PRIMARY KEY,
  passmd5 text, 
  display_name text NOT NULL
);

SELECT * FROM user_for_test;
```

使用generate_series播入数据。
```sql
INSERT INTO user_for_test(
  username,
  passmd5,
  display_name
) 
SELECT 
  'username-' || substring(md5(random()::text), 0, 4) || '-' || i,
  md5(random()::text),
  'user_' || substring(md5(random()::text), 0, 6)
FROM generate_series(1, 3) AS i;

SELECT * FROM user_for_test;
```

如果是简单的表，也可以直接用VALUES。
```sql
INSERT INTO user_for_test(
  username,
  passmd5,
  display_name
) 
VALUES (
  'username-' || generate_series(1, 3),
  md5(random()::text),
  'user_' || generate_series(8, 10)
);

SELECT * FROM user_for_test;
```
