---
title: windows回收站的工作原理
date: 2023-06-29 14:26:13
tags:
description: windows回收站我们都用过，本文揭秘它的工作原理。
---
windows上的回收站功能我们应该都用过，只要不是使用`Shift+Delete`直接删除，删除的文件或文件夹都会先进入回收站，给我们一次反悔的机会。

## 显示或隐藏回收站
如果你发现桌面上没有回收站图标，可以在这里打开：

{% asset_img show-or-hide.png 显示或隐藏回收站 %}

如果你使用了Wallpaper Engine之类的桌面，那么可以直接在文件管理器的地址中输入`回收站`来直接跳转。

## 本质

回收站本质上就是特殊的文件夹。当我们删除一个文件或文件夹时，系统会将其移动到回收站，而不是直接删除。直到用户彻底删除或清空回收站时，系统才会真正删除。而在那之前，随时可以还原被删除的文件。

在每个磁盘的根目录都有一个名为`$Recycle.bin`的文件夹，在`回收站 属性`中可以设置是否开启，以及它的最大占用空间（默认值为磁盘总大小的5%左右）。
  
{% asset_img property.png "回收站 属性" %}

每个磁盘下的`$Recycle.bin`各自维护自己的回收站，而在打开回收站应用时，会将所有磁盘的回收站内容合并显示。

{% asset_img recycle-bin.png 合并显示 %}

## 目录结构

### 分用户存放
在`$Recycle.bin`文件夹下，会分用户来存放被删除的文件。比如：
```bash
C:/
└── $Recycle.bin/
    ├── S-1-5-18
    ├── S-1-5-21-3224713530-1295428985-2222104684-1000
    └── S-1-5-21-3224713530-1295428985-2222104684-1001
```
目录名称是用户的[SID](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers)，在windows中大量使用，可以在注册表`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList`中找到每个用户名对应的SID。

### 个性化文件夹
在每个用户目录下，都会有一个`desktop.ini`，来描述这个文件夹[如何显示](https://learn.microsoft.com/en-us/windows/win32/shell/how-to-customize-folders-with-desktop-ini)。
```ini
[.ShellClassInfo]
CLSID={645FF040-5081-101B-9F08-00AA002F954E}
LocalizedResourceName=@%SystemRoot%\system32\shell32.dll,-8964
```

### 被删除的文件
被删除的文件在移动进回收站时，为了避免重名，会被重新命名。生成一个唯一ID后命名为`$R{id}.{ext}`，扩展名维持原样。然后将元数据存放至`$I{id}.{ext}`。
元数据包括：文件名称，文件原路位置，删除时间，文件大小。基本上就是我们在回收站应用中看到的信息。

$I文件的结构为：
| 偏移 | 字节 | 说明 |
|---:|---:|---|
| 0 | 4 | $I文件的版本号，win10为2，vista到10之前都为1 |
| 8 | 8 | 文件的大小 |
| 16 | 8 | 删除时间 |
| 24 | 4 | 文件名的长度，版本v2才有这项 |
| 28 | 不定长 | 文件名 |

我们拿`BaiduNetdisk_6.8.4.1.exe`这个文件来看看：
```
C:/
└── $Recycle.bin/
    └── S-1-5-21-3224713530-1295428985-2222104684-1001/
        ├── $IAA5WRG.exe
        ├── $RAA5WRG.exe
        └── desktop.ini
```
使用十六进制文本编辑器来查看文件，直接可以使用vscode的[Hex Editor](https://marketplace.visualstudio.com/items?itemName=ms-vscode.hexeditor)插件，也可以使用[HxD](https://mh-nexus.de/en/hxd/)等工具。推荐使用vscode：
```bash
code 'C:\$Recycle.Bin\S-1-5-21-3224713530-1295428985-2222104684-1001>\$IAA5WRG.exe'
```

`$IAA5WRG.exe`的内容为：

{% asset_img $I-struct.png "$I文件结构" %}

按照上面的结构解析：
- 版本号为2
- 文件大小为`0x026688F0`，十进制为40274160，与回收站中显示的`39,331 KB`一致
- 删除时间为`0x01D9AA55734E8C90`，十进制为133324947967610000，使用`w32tm.exe /ntte 133324947967610000`转换为`2023/6/29 14:46:36`，与回收站中显示一致
- 文件名长度为`0x00000036`，十进制为54，表示文件名占了54个unicode，即108个字节
- 文件名为`C:\BaiduNetdiskDownload\记录数据\BaiduNetdisk_6.8.4.1.exe`，包含末尾的`0x0000`，刚好108个字节

### 被删除的文件夹
再来看看文件夹。
```
F:/
└── $Recycle.bin/
    └── S-1-5-21-3224713530-1295428985-2222104684-1001/
        ├── $rzg1h6u/
        │   ├── b/
        │   │   └── 1.txt
        │   └── a.txt
        ├── $izg1h6u
        └── desktop.ini
```
可以发现，文件夹中的内容原封不动的被移动了过来。

再看看$I文件。
{% asset_img $I-struct-of-folder.png 文件夹的$I文件 %}

按照上面的结构解析：
- 版本号为2
- 文件大小为`0x00000001`，十进制为1，与回收站中显示的`1 KB`一致
- 删除时间为`0X01D9AA5405E4B630`，十进制为133324941836990000，使用`w32tm.exe /ntte 133324941836990000`转换为`2023/6/29 14:36:23`，与回收站中显示一致
- 文件名长度为`0x00000009`，十进制为9，表示文件名占了9个unicode，即18个字节
- 文件名为`F:\tmp\a`，包含末尾的`0x0000`，刚好18个字节

## 深入

### 为什么windows回收站不允许展开文件夹呢？

我理解不允许展开的原因是删除一整个文件夹是一个可回退的原子操作，所以要还原就还原整个文件夹，不允许还原部分文件。

而如果允许展开，就很容易给用户一个错觉：允许还原文件夹中的某单个文件。但右键后又发现不能这样操作，容易给用户造成困惑。

### macOS的垃圾篓有什么不同吗？

macOS的垃圾篓和windows回收站一样也是一个文件夹，位置在`~/.trash`。

与windows回收站的一个很大不同是它没有像windows那样将删除的文件更名为`$I{id}`，而是保持了原名称。所以如果连续删除两个重名文件，后删除的那个会被自动重命名。
