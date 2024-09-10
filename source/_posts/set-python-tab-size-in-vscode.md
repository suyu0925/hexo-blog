---
title: 在vscode中修改python的tab size
date: 2024-09-10 10:22:00
tags:
- vscode
description: 默认的空格缩进都是2格，但python还是更习惯4格，需要单独设置一下。
---

在vscode内置的设置界面`CTRL+,`中似乎无法针对语言单独设置，我们可以直接编辑`"$ENV:APPDATA\Code\User\settings.json"`。

```json
{
    "git.autofetch": true,
    "[python]": {
        "editor.tabSize": 4,
        "editor.indentSize": 4,
        "editor.defaultFormatter": "ms-python.autopep8"
    },
    "editor.tabSize": 2,
    "notebook.editorOptionsCustomizations": {
        "editor.tabSize": 4,
        "editor.indentSize": 4,
        "editor.insertSpaces": false
    }
}
```

使用`"[python]"`即可单独设置python文件。
