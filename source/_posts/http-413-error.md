---
title: http请求的413错误
date: 2019-05-15 18:01:03
description: 当收到服务器返回413时，可检查这几处：
tags:
---

当收到服务器返回413时，可检查这几处：

## nginx

```conf
client_max_body_size 50M;
```

默认值只有1M。

## koa-bodyparser

formLimit: limit of the urlencoded body. If the body ends up being larger than this limit, a 413 error code is returned. Default is 56kb.

jsonLimit: limit of the json body. Default is 1mb.

textLimit: limit of the text body. Default is 1mb.

## body-parser

```javascript
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
```

## multer

**limits**

An object specifying the size limits of the following optional properties. Multer passes this object into busboy directly, and the details of the properties can be found on busboy's page.

The following integer values are available:

| Key | Description | Default |
| - | - | - |
| fieldNameSize | Max field name size | 100 bytes |
| fieldSize | Max field value size | 1MB |
| fields | Max number of non-file fields | Infinity |
| fileSize | For multipart forms, the max file size (in bytes) | Infinity |
| files | For multipart forms, the max number of file fields | Infinity |
| parts | For multipart forms, the max number of parts (fields + files) | Infinity |
| headerPairs |  For multipart forms, the max number of header key=>value pairs to parse | 2000 |

Specifying the limits can help protect your site against denial of service (DoS) attacks.

