---
title: veighna初体验
date: 2024-08-28 14:28:47
tags:
- quant
description: 兜兜转转还是回到veighna这里来了，记录一下使用体会。
hidden: true
---

为了方便阅读，之后会用vnpy来代替veighna，两者绝大时候是同一个意思。

## [datafeed数据服务](https://www.vnpy.com/docs/cn/community/info/veighna_trader.html#datafeed)

在使用vnpy之前，先要配置[datafeed](https://www.vnpy.com/docs/cn/community/info/datafeed.html)。

vnpy目前共支持7个数据服务：

- xt。迅投。完成注册后自动开启14天基础行情试用。
- tushare。需要2000积分才能使用[期货数据](https://tushare.pro/document/2?doc_id=135)，相当于200元。
- rqdata。米筐。申请试用需上传金融机构名片。
- tqsdk。天勤。需要专业版才能[下载数据](https://doc.shinnytech.com/tqsdk/latest/reference/tqsdk.tools.download.html)。
- wind。万得。仅针对企业用户试用。
- ifind。同花顺ifind。仅针对企业用户试用。
- tinfysoft。天软。天软不支持python3.10，veighna studio 3.0开始已停止支持。
- udata。恒有数udata。网站打不开。

综上，短期试用选迅投，个人自用选tushare。

## CTP

### 模拟盘

模拟盘可以用[simnow的ctp](https://www.simnow.com.cn/product.action)。

用户名：simnow的投资者代码，`investorId`
密码：simnow登录密码
经纪商代码：`9999`
交易服务器：`180.168.146.187:10201`
行情服务器：`180.168.146.187:10211`
产品名称：可不填。
授权编码：可不填。

### 实盘

实盘CTP比较麻烦，要期货公司评测通过后才会开通。

用户名：期货公司开户后分配得到
密码：开户时设置的登录密码
经纪商代码：期货公司编号
交易服务器：期货公司给出
行情服务器：期货公司给出
产品名称：按照期货公司要求，自行定义并由期货公司确认
授权编码：在期货公司的评测环境测试通过，由期货公司分配。

## 附录

### 运行官方示例遇到的问题

在官方文档[Windows安装指南](https://www.vnpy.com/docs/cn/community/install/windows_install.html#id3)中，提供了一个测试veighna的例子：

```python
from pyqtgraph import examples
examples.run()
```

但点击`Run Example`后，会提示出错

```sh
Traceback (most recent call last):
  File "D:\veighna_studio\lib\site-packages\pyqtgraph\examples\CLIexample.py", line 10, in <module>
    import numpy as np
  File "D:\veighna_studio\lib\site-packages\numpy\__init__.py", line 163, in <module>
    from . import lib
  File "D:\veighna_studio\lib\site-packages\numpy\lib\__init__.py", line 23, in <module>
    from . import index_tricks
  File "D:\veighna_studio\lib\site-packages\numpy\lib\index_tricks.py", line 12, in <module>
    import numpy.matrixlib as matrixlib
  File "D:\veighna_studio\lib\site-packages\numpy\matrixlib\__init__.py", line 4, in <module>
    from . import defmatrix
  File "D:\veighna_studio\lib\site-packages\numpy\matrixlib\defmatrix.py", line 12, in <module>
    from numpy.linalg import matrix_power
  File "D:\veighna_studio\lib\site-packages\numpy\linalg\__init__.py", line 73, in <module>
    from . import linalg
  File "D:\veighna_studio\lib\site-packages\numpy\linalg\linalg.py", line 20, in <module>
    from typing import NamedTuple, Any
  File "D:\veighna_studio\lib\site-packages\typing.py", line 1359, in <module>
    class Callable(extra=collections_abc.Callable, metaclass=CallableMeta):
  File "D:\veighna_studio\lib\site-packages\typing.py", line 1007, in __new__
    self._abc_registry = extra._abc_registry
AttributeError: type object 'Callable' has no attribute '_abc_registry'
```

查了下原因是[typing库](https://pypi.org/project/typing/)在python 3.5之后就[内置了](https://docs.python.org/3/library/typing.html)，无需再使用安装包。

解决方法是直接`pip uninstall typing`。
