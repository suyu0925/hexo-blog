---
title: 在pgadmin4中查询前100行执行得很慢
date: 2023-12-04 14:37:00
tags: sql
description: 在pgadmin4中，发现查询某一个表的前100行或后100行都执行得很慢，但其它表却正常。
---

先看[pgAdmin](https://www.pgadmin.org/)中，查看前 100 行时生成的 sql 代码：

```sql
SELECT * FROM data_item
ORDER BY "time" ASC, data_def_id ASC LIMIT 100
```

而`data_item`表的定义为：

```sql
CREATE TABLE IF NOT EXISTS data_item
(
    "time" timestamp without time zone NOT NULL,
    value jsonb NOT NULL,
    data_def_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT data_item_pkey PRIMARY KEY (data_def_id, "time"),
    CONSTRAINT data_item_data_def_id_fkey FOREIGN KEY (data_def_id)
        REFERENCES data_def (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
```

好嘛，原来问题在这。我们创建的主键是`(data_def_id, "time")`，而生成的查询语句却是`ORDER BY "time" ASC, data_def_id ASC`。

多字段主键的使用必须与创建时的顺序一致，否则会导致全表扫描。

## 查看 pgadmin4 源码

去瞄一眼[pgadmin4 的源码](https://github.com/pgadmin-org/pgadmin4)。

通过`First 100 Rows`可以找到，在[/web/pgadmin4/tools/sqleditor/command.py]中定义的[VIEW_FIRST_100_ROWS](https://github.com/pgadmin-org/pgadmin4/blob/master/web/pgadmin/tools/sqleditor/command.py#L28)常量。

它在`TableCommand.get_sql`函数中[被使用](https://github.com/pgadmin-org/pgadmin4/blob/master/web/pgadmin/tools/sqleditor/command.py#L503)：

```python
# If data sorting is none and not reset from the filter dialog then
# set the data sorting in following conditions:
#   1. When command type is VIEW_FIRST_100_ROWS or VIEW_LAST_100_ROWS.
#   2. When command type is VIEW_ALL_ROWS and limit is greater than 0

if data_sorting is None and \
    not self.is_sorting_set_from_filter_dialog() \
    and (self.cmd_type in (VIEW_FIRST_100_ROWS, VIEW_LAST_100_ROWS) or
          (self.cmd_type == VIEW_ALL_ROWS and self.data_sorting_by_pk)):
    sorting = {'data_sorting': []}
    for pk in primary_keys:
        sorting['data_sorting'].append(
            {'name': pk, 'order': self.get_pk_order()})
    self.set_data_sorting(sorting)
    data_sorting = self.get_data_sorting()
```

所以问题出在`primary_keys`，它的键值与我们创建的主键顺序不一致。

再继续看`primary_keys`，它在`TableCommand.get_primary_keys`函数中通过[查询](https://github.com/pgadmin-org/pgadmin4/blob/master/web/pgadmin/tools/sqleditor/command.py#L543)`sql_path/primary_keys.sql`模板文件[被设置](https://github.com/pgadmin-org/pgadmin4/blob/master/web/pgadmin/tools/sqleditor/command.py#L556)，

`sql_path`由`manager.version`决定，`self.sql_path = 'sqleditor/sql/#{0}#'.format(manager.version)`，通常是`default`。我们进一步查看填入参数后的[/web/pgadmin/tools/sqleditor/templates/sqleditor/sql/default/primary_keys.sql](https://github.com/pgadmin-org/pgadmin4/blob/master/web/pgadmin/tools/sqleditor/templates/sqleditor/sql/default/primary_keys.sql)模板文件。

首先是查询`data_item`中的主键：

```sql
SELECT con.conkey
FROM pg_catalog.pg_class rel
LEFT OUTER JOIN pg_catalog.pg_constraint con ON con.conrelid=rel.oid
JOIN pg_catalog.pg_namespace AS nsp ON nsp.oid=REL.relnamespace
AND con.contype='p'
WHERE rel.relkind IN ('r',
                      's',
                      't')
  AND rel.relname = 'data_item'
  AND nsp.nspname= 'public'
```

查询结果为：

```
"conkey"
{3,1}
```

此处的`{3,1}`对应着`PRIMARY KEY (data_def_id, "time")`，在创建表的定义中，`"time"`是第 1 列，`data_def_id`是第 3 列。

但在后续的查询列名时，却失去了顺序信息，导致了问题。

```sql
SELECT at.attname,
       at.attnum,
       ty.typname
FROM pg_catalog.pg_attribute AT
LEFT JOIN pg_catalog.pg_type ty ON (ty.oid = at.atttypid)
JOIN pg_catalog.pg_class AS cl ON cl.oid=AT.attrelid
JOIN pg_catalog.pg_namespace AS nsp ON nsp.oid=cl.relnamespace
WHERE cl.relname = 'data_item'
  AND nsp.nspname= 'public'
  AND attnum = ANY (
                      (SELECT con.conkey
                       FROM pg_catalog.pg_class rel
                       LEFT OUTER JOIN pg_catalog.pg_constraint con ON con.conrelid=rel.oid
                       JOIN pg_catalog.pg_namespace AS nsp ON nsp.oid=REL.relnamespace
                       AND con.contype='p'
                       WHERE rel.relkind IN ('r',
                                             's',
                                             't')
                         AND rel.relname = 'data_item'
                         AND nsp.nspname= 'public' )::oid[])
```

查询结果为：

```
"attname"	"attnum"	"typname"
"time"	1	"timestamp"
"data_def_id"	3	"text"
```

## 解决方案

1. 优化这一段查询语句，保持多列主键中列的顺序信息。
2. 在定义表时，将`"time"`放在第 1 列，`data_def_id`放在第 3 列。
3. 容忍这个问题，在`data_item`表不使用 pgadmin4 的`100 Rows`功能。

有兴趣的同学可以试试第一种方案，去刷一个[PR](https://github.com/pgadmin-org/pgadmin4/pulls)。
