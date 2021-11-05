---
title: 使用pgsql存储层级数据
date: 2021-07-28 16:50:08
tags:
description: 习惯了nosql再使用sql来存储层级数据总是觉得麻烦，这次彻底的撸一遍。
---
首先这个层级数据一定是很小量的数据，如果数据量很大，那必然是每一级一张表，然后做外键。

假设我们有这样的数据要存入数据库：公司，部门，员工。

## nosql
如果使用nosql比如mongodb，我们可以把所有数据都存在一个表里。

定义数据库中的数据类型，数据类型几乎可以与前端保持一致。
```typescript
type Company = {
  id: string
  name: string
  departments: Department[]
}

type Department = {
  id: string
  name: string
  employees: Employee[]
}

type Employee = {
  id: string
  name: string
}
```

新建公司时，只需要做一次插入动作。
```typescript
const companies: Company[] = [{
  id: 'alibaba',
  name: '阿里巴巴',
  departments: [{
    id: 'research-2',
    name: '研发二部',
    employees: [{
      id: '2021123',
      name: '张三'
    }]
  }]
}]

db.collection('company').insertMany(companies)
```

当要修改任何一处数据时，我们都直接更新整个结构的数据。
```typescript
const updatedCompany: Company = {
  id: 'alibaba',
  name: '阿里巴巴',
  departments: [{
    id: 'research-3',
    name: '研发三部',
    employees: [{
      id: '2021123',
      name: '张三三'
    }, {
      id: '2021124',
      name: '李四'
    }]
  }]
}

db.collection('company').updateOne({id: updatedCompany.id}, {$set: updatedCompany})
```

## sql
但如果使用通用sql，就需要这样做：

```sql
CREATE TABLE company (
  id      SERIAL,
  name    TEXT,
  CONSTRAINT pk_company PRIMARY KEY (id)
);

CREATE TABLE department (
  id              SERIAL,
  name            TEXT,
  company_id      INT,
  CONSTRAINT pk_department PRIMARY KEY (id),
  CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES company(id)
);

CREATE TABLE employee (
  id              SERIAL,
  name            TEXT,
  department_id   INT,
  company_id      INT,
  CONSTRAINT pk_employee PRIMARY KEY (id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id),
  CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES company(id)  
);
```

新建公司时，拿到前端数据后，必须从上到下的创建。

```python
from sqlalchemy import *
engine = create_engine("postgresql://username:password@localhost/testdb", echo=True)

with engine.connect() as conn:
    metadata = MetaData()
    company = Table('company', metadata, autoload_with=engine)
    ins = company.insert().values(name='阿里巴巴')
    result = conn.execute(ins)
    company_id = result.inserted_primary_key[0]

    department = Table('department', metadata, autoload_with=engine)
    ins = department.insert().values(name='研发二部', company_id=company_id)
    result = conn.execute(ins)
    department_id = result.inserted_primary_key[0]

    employee = Table('employee', metadata, autoload_with=engine)
    ins = employee.insert().values(name='研发二部', company_id=company_id, department_id=department_id)
    result = conn.execute(ins)
    employee_id = result.inserted_primary_key[0]
```

当修改时，也需要从上到下。比如当员工的部门变化时，需要先确保新部门存在，再修改员工记录。

如果要像mongodb那样一次更新整个结构，可以用一个事务清空再重建。

## [ltree extension](https://www.postgresql.org/docs/current/ltree.html)
ltree是postgresql的一个扩展插件，它提供了一种数据类型`ltree`来支持树形结构的存储，同时支持基于标签的查询。

直接上例子：
```sql
CREATE EXTENSION ltree;

CREATE TABLE test (path ltree);
INSERT INTO test VALUES ('Top');
INSERT INTO test VALUES ('Top.Science');
INSERT INTO test VALUES ('Top.Science.Astronomy');
INSERT INTO test VALUES ('Top.Science.Astronomy.Astrophysics');
INSERT INTO test VALUES ('Top.Science.Astronomy.Cosmology');
INSERT INTO test VALUES ('Top.Hobbies');
INSERT INTO test VALUES ('Top.Hobbies.Amateurs_Astronomy');
INSERT INTO test VALUES ('Top.Collections');
INSERT INTO test VALUES ('Top.Collections.Pictures');
INSERT INTO test VALUES ('Top.Collections.Pictures.Astronomy');
INSERT INTO test VALUES ('Top.Collections.Pictures.Astronomy.Stars');
INSERT INTO test VALUES ('Top.Collections.Pictures.Astronomy.Galaxies');
INSERT INTO test VALUES ('Top.Collections.Pictures.Astronomy.Astronauts');
CREATE INDEX path_gist_idx ON test USING GIST (path);
CREATE INDEX path_idx ON test USING BTREE (path);
```

继承关系：
```sql
ltreetest=> SELECT path FROM test WHERE path <@ 'Top.Science';
                path
------------------------------------
 Top.Science
 Top.Science.Astronomy
 Top.Science.Astronomy.Astrophysics
 Top.Science.Astronomy.Cosmology
(4 rows)
```

路径匹配：
```sql
ltreetest=> SELECT path FROM test WHERE path ~ '*.Astronomy.*';
                     path
-----------------------------------------------
 Top.Science.Astronomy
 Top.Science.Astronomy.Astrophysics
 Top.Science.Astronomy.Cosmology
 Top.Collections.Pictures.Astronomy
 Top.Collections.Pictures.Astronomy.Stars
 Top.Collections.Pictures.Astronomy.Galaxies
 Top.Collections.Pictures.Astronomy.Astronauts
(7 rows)

ltreetest=> SELECT path FROM test WHERE path ~ '*.!pictures@.*.Astronomy.*';
                path
------------------------------------
 Top.Science.Astronomy
 Top.Science.Astronomy.Astrophysics
 Top.Science.Astronomy.Cosmology
(3 rows)
```

文本搜索：
```sql
ltreetest=> SELECT path FROM test WHERE path @ 'Astro*% & !pictures@';
                path
------------------------------------
 Top.Science.Astronomy
 Top.Science.Astronomy.Astrophysics
 Top.Science.Astronomy.Cosmology
 Top.Hobbies.Amateurs_Astronomy
(4 rows)

ltreetest=> SELECT path FROM test WHERE path @ 'Astro* & !pictures@';
                path
------------------------------------
 Top.Science.Astronomy
 Top.Science.Astronomy.Astrophysics
 Top.Science.Astronomy.Cosmology
(3 rows)
```

回到公司部门员工的应用场景。

```sql
CREATE TABLE employee_ltree (id_path ltree, name_path ltree);

-- 注意ltree不能用'-'，要用'_'代替
INSERT INTO employee_ltree VALUES ('alibaba.research_2.2021123', '阿里巴巴.研发二部.张三'); 
INSERT INTO employee_ltree VALUES ('alibaba.research_2.2021123', '阿里巴巴.研发二部.李四'); 
INSERT INTO employee_ltree VALUES ('alibaba.research_3.2021123', '阿里巴巴.研发三部.王五');
INSERT INTO employee_ltree VALUES ('tencent.marketing.199800001', '腾讯.市场部.钱一'); 
```

查找所有公司
```sql
SELECT DISTINCT subpath(id_path, 0, 1)::text AS id, subpath(name_path, 0, 1)::text AS name FROM employee_ltree;
```

查找研发二部下的员工
```sql
SELECT DISTINCT subpath(id_path, 2, 1)::text AS id, subpath(name_path, 2, 1)::text AS name 
FROM employee_ltree
WHERE name_path ~ '*.研发二部.*';
```

查找alibaba的所有员工
```sql
SELECT DISTINCT subpath(id_path, 2, 1)::text AS id, subpath(name_path, 2, 1)::text AS name 
FROM employee_ltree
WHERE id_path <@ 'alibaba';
```

## [json](https://www.postgresql.org/docs/current/functions-json.html)

```sql
CREATE TABLE company (
  id    serial NOT NULL PRIMARY KEY,
  info  json NOT NULL
);
```

插入数据：
```sql
INSERT INTO company (info)
VALUES
  ('{"id":"alibaba","name":"阿里巴巴","departments":[{"id":"research-2","name":"研发二部","employees":[{"id":"2021123","name":"张三"}]}]}'),
  ('{"id":"alibaba","name":"阿里巴巴","departments":[{"id":"research-2","name":"研发二部","employees":[{"id":"2021124","name":"李四"}]}]}'),
  ('{"id":"alibaba","name":"阿里巴巴","departments":[{"id":"research-3","name":"研发三部","employees":[{"id":"2021125","name":"王五"}]}]}'),
  ('{"id":"tencent","name":"腾讯","departments":[{"id":"marketing","name":"市场部","employees":[{"id":"199800001","name":"钱一"}]}]}')
;
```

查找阿里巴巴的研发二部的所有员工
```sql
SELECT 
  json_array_elements(x.department -> 'employees') ->> 'id' AS id,
  json_array_elements(x.department -> 'employees') ->> 'name' AS name
FROM (
  SELECT 
    json_array_elements(info -> 'departments') AS department
  FROM company
  WHERE info ->> 'name' = '阿里巴巴'
) AS x
WHERE department ->> 'name' = '研发二部'
;
```

## [复合类型](https://www.postgresql.org/docs/current/rowtypes.html)

使用psql的复合类型也可以用来存储与查询层级数据。

```sql
CREATE TYPE employee AS (
  id              text,
  name            text
);
CREATE TYPE department AS (
  id              text,
  name            text,
  employees       employee array
);
CREATE TABLE company (
  id              text PRIMARY KEY,
  name            text,
  departments     department array
);
```

```sql
INSERT INTO company
VALUES 
  ('alibaba', '阿里巴巴', array[
    ('research_2', '研发二部', array[
      ('2021123', '张三'),
      ('2021124', '李四')
    ]::employee[]),
    ('research_3', '研发三部', array[
      ('2021125', '王五')
    ]::employee[])    
  ]::department[]),
  ('tencent', '腾讯', array[
    ('marketing', '市场部', array[
      ('199800001', '钱一')
    ]::employee[])    
  ]::department[])  
;
```

查询研发二部下的员工
```sql
SELECT (employee).id AS id, (employee).name AS name
FROM (
  SELECT UNNEST((department).employees) AS employee
  FROM (
    SELECT UNNEST(departments) AS department FROM company
  ) x
  WHERE (department).name = '研发二部'
) y
;
```

以上这些方法可以根据实际需求来选择。
