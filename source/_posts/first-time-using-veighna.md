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

## 历史数据管理

vnpy提供了历史数据管理模块：[DataManager](https://www.vnpy.com/docs/cn/community/app/data_manager.html)。

### 完整合约代码

各个交易所给出的合约代码各不相同，在全球范围还有重复。所以为了防止重名，也是为了统一，在数据处理时都会将交易所给出的合约代码做一个规范化处理。

- 交易所编码。比如上期所的螺纹钢`rb2410`，我们会在后面加上上期所的编码`SHFE`，拼得`rb2410.SHFE`，作为完整合约代码。
- 年月对齐。合约月份既有`YYMM`也有`YMM`，比如螺纹钢的`rb2410`和尿素的`UR501`。
- 大小写。合约代码既有大写又有小写，比如螺纹钢`rb`和尿素`UR`。

经过规范化后，螺纹钢变成了`RB2401.SHFE`，尿素变成了`UR2501.CZCE`。
但各家有各家的规范化方法，并不一定一样。

vnpy采用的规范化方法是只加交易所编码，不改变年月对齐和大小写。这样的好处提交到CTP不用再做一次转化。但坏处是不利于记忆，在输入合约时一定要有自动提示。
迅投简化了交易所代码，比如上期所`SHFE`简称为`SF`。

### 连续合约的命名

[连续合约](https://akshare.akfamily.xyz/data/futures/futures.html#id17)有主力连续、主力连续平滑、指数（加权）、月份连续等等。

命名方法都是把年月改成不会混淆的其它数字。但各家都有不同的规范。

[米筐的连续合约](https://www.ricequant.com/doc/rqdata/python/futures-mod.html#%E8%BF%9E%E7%BB%AD%E5%90%88%E7%BA%A6)：

- 主力连续：88
- 主力连续前复权平滑：888
- 主力连续后复权平滑：889
- 次主力连续：88A2
- 指数（加权）：99

[聚宽的连续合约](https://www.joinquant.com/help/api/help#Future:%E4%B8%BB%E5%8A%9B%E8%BF%9E%E7%BB%AD%E5%90%88%E7%BA%A6%E5%8F%8A%E5%93%81%E7%A7%8D%E6%8C%87%E6%95%B0)命名：

- 主力：9999
- 指数：8888

[迅投的连续合约](https://dict.thinktrader.net/dictionary/future.html#%E4%B8%BB%E5%8A%9B%E8%BF%9E%E7%BB%AD%E5%90%88%E7%BA%A6%E5%8F%8A%E5%8A%A0%E6%9D%83)命名与常规不同：

- 主力连续：00
- 次主力连续：01
- 加权：JQ00
- 月份连续：去掉年

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
