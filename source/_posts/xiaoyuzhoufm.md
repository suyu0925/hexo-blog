---
title: "小宇宙FM：先看后听"
date: 2024-10-24 09:18:07
tags:
description: 小宇宙节目经常只有音频没有目录和简介，其实可以简单的自己做一个。
---

## 获取链接

首先在手机上分享某一集节目，然后选择复制链接，如下图所示：

{% asset_image share.png 分享链接 %}

会得到一个小宇宙的 PC 端链接，如`https://www.xiaoyuzhoufm.com/episode/67164e0d0d2f24f289c01c1e`。

## 下载音频

小宇宙没有对反爬做任何限制，音频文件的地址就放在了网页的`Head`中。

```html
<html>
  <head>
    <meta
      property="og:title"
      content="寻根究底：物理层面上看，硅基生命能不能取代碳基生命存在？"
    />
    <meta
      property="og:audio"
      content="https://media.xyzcdn.net/lmYfADB-A94B_DFJkN6YE4VgX_Y7.m4a"
    />
  </head>
</html>
```

音频文件的网址`https://media.xyzcdn.net/lmYfADB-A94B_DFJkN6YE4VgX_Y7.m4a`可以直接下载。随便用一个爬虫就能下载到音频文件。

{% spoiler BeatifulSoup %}
比如使用[BeatifulSoup 4](https://www.crummy.com/software/BeautifulSoup/):

```python
import requests
from bs4 import BeautifulSoup

def parse_url(url: str):
  edge_user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59"
  headers = {
    "User-Agent": edge_user_agent,
  }  
  response = requests.get(url, headers=headers)
  soup = BeautifulSoup(response.content, 'html.parser')

  title_tag = soup.find('meta', {'property': 'og:title'})
  audio_tag = soup.find('meta', {'property': 'og:audio'})

  return {
    'title': title_tag['content'],
    'audio_url': audio_tag['content'],
  }

def download_audio(title: str, audio_url: str):
  response = requests.get(audio_url)
  filename = f"{title}.m4a"

  with open(filename, "wb") as f:
    f.write(response.content)

  print(f"音频文件 {filename} 下载完成！")

url = input("请输入网页地址：")
parsed = parse_url(url)
download_audio(parsed['title'], parsed['audio_url'])
```
{% endspoiler %}

## Speech To Text

STT可以使用OenAI的[whisper](https://github.com/openai/whisper)。

安装后可直接使用命令行：

```sh
whisper audio.m4a --language Mandarin
```

会生成`.srt`、`.vtt`、`.txt`三个文件，分别是字幕、视频字幕、文本。

也可以在Python中使用：

```python
import whisper

model = whisper.load_model("turbo")
result = model.transcribe("audio.m4a")
text = '\n'.join([x['text'] for x in result['segments']])
open("audio.txt", "w").write(text)
```

## 校对与总结

使用LLM模型校对文本，然后总结要点。

```text
你是一个文字处理专家，擅长校正语音识别出的文章和要点总结。

将下面文章中的错别字修正，加上合适的标点符号，分成合适的段落，去掉多余的语气词和重复的口癖。
文章内容如下：
<识别内容>
```

```text
总结一下这篇文章的要点
```

也可以使用python脚本：

{% spoiler python脚本 %}
```python
from openai import OpenAI

client = OpenAI(api_key="sk-f0fb83f90c8b44adab28eec400417621", base_url="https://api.deepseek.com")

text = open("audio.txt").read()
messages = [
    {"role": "system", "content": "你是一个文字处理专家，擅长校正语音识别出的文章和要点总结。"},
]
messages.append({
    "role": "user", 
    "content": 
f"""
将下面文章中的错别字修正，加上合适的标点符号，分成合适的段落，去掉多余的语气词和口癖。
文章内容如下：
{txt}
"""},
)
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages,
    stream=False,
)
messages.append(response.choices[0].message)

open("proofread.txt", "w").write(response.choices[0].message['content'])

messages.append({
    "role": "user", 
    "content": "总结一下这篇文章的要点"},
)
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=messages,
    stream=False,
)
messages.append(response.choices[0].message)

open("birefs.txt", "w").write(response.choices[0].message['content'])
```
{% endspoiler %}

代码汇总在[xiaoyuzhoufm](https://github.com/suyu0925/xiaoyuzhoufm)项目。
