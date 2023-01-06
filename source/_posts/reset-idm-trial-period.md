---
title: 重置idm的30天试用期
date: 2022-07-06 23:43:44
tags:
- 善用佳软
description: idm是windows下最好的下载工具之一，但它是付费软件，我们很穷但又坚持不肯使用盗版，所以……
---
[idm](https://www.internetdownloadmanager.com/)是windows下最好的下载工具之一，但它是付费软件，我们很穷但又坚持不肯使用盗版，所以我们决定延长它的试用期限。

和[Beyond Compare](https://www.scootersoftware.com/)类似，它的试用开始时间是保存在注册表里的，所以我们只需要在注册表里清除这一项即可。

它在注册表中保存在`计算机\HKEY_USERS\S-1-5-21-3017953563-992067650-4147715027-1001_Classes\WOW6432Node\CLSID\{07999AC3-058B-40BF-984F-69EB1E554CA7}`，
注意`S-1-5-21-3017953563-992067650-4147715027-1001_Classes`在不同的电脑上中间的数字会不同。

我们只需要
1. 彻底关闭idm
2. 删除注册表中的这一项
3. 重新打开idm

即可重置试用期。

nsaneforums上的[windowsaddict](windowsaddict@protonmail.com)在[论坛帖子(访问需登录)](nsaneforums.com/topic/371047--/?do=findComment&comment=1578647)里提供了一个[激活脚本下载](http://www.box.com/index.php?rm=box_download_shared_file&shared_name=5wlww2p267sbp3nysh5c6cxrp0ofrzre&file_id=f_901589409735?s=5wlww2p267sbp3nysh5c6cxrp0ofrzre)。出于安全考虑，类似这种脚本只建议在虚拟机中使用。

其实IDM也不贵，[终身授权只需165元](https://secure.internetdownloadmanager.com/buy_idm.html)，如果手上不紧还是建议入一份正版。
