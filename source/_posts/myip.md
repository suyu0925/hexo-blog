---
title: 我的IP
date: 2024-11-26 15:46:16
tags:
description: 快速查看我的IP地址。
---

整理了一些查看我的 IP 的网址，方便查阅。在访问这些网址时，最好在后面加上`?_t={timestamp}`以避免缓存。

## 国内

先看国内的，防止触发梯子显示代理的 IP。

### 腾讯新闻

腾讯新闻的 IP API 网址是[https://r.inews.qq.com/api/ip2city](https://r.inews.qq.com/api/ip2city)，返回格式是 json。

```json
{
  "ret": 0,
  "errMsg": "",
  "ip": "103.219.30.12",
  "provcode": "13",
  "citycode": "118",
  "country": "中国",
  "province": "浙江省",
  "city": "杭州市",
  "district": "",
  "isp": "",
  "districtCode": "330100",
  "callback": ""
}
```

有很多国内的网站都会调用这个 api 来针对不同地区的用户显示不同内容，可以纯前端实现。

### 头条天气

头条天气的网址是[https://www.toutiao.com/stream/widget/local_weather/data/](https://www.toutiao.com/stream/widget/local_weather/data/)，它主要作用是返回天气数据，但也会带上 IP。返回格式同样是 json。

```json
{
  "data": {
    "city": "杭州",
    "ip": "103.219.30.12",
    "weather": {
      "alert": null,
      "aqi": 31,
      "city_name": "杭州",
      "current_condition": "多云",
      "current_temperature": 13,
      "current_time": 1732608146,
      "dat_condition": "晴",
      "dat_high_temperature": 14,
      "dat_low_temperature": 4,
      "dat_weather_icon_id": "0",
      "day_condition": "多云",
      "": "还有很多数据，省略"
    }
  }
}
```

### ip138

[ip138](https://ip138.com/)提供简短的查询网址：[https://2024.ip138.com/](https://2024.ip138.com/)，返回的是一个简略的包含 IP 地址的 html 页面。不知道到 2025 年域名会变成什么。

### visa 中国

[visa 中国](https://www.visa.cn/)使用了 cloudflare 的调试工具[/cdn-cgi/trace](https://developers.cloudflare.com/fundamentals/reference/cdn-cgi-endpoint/)：[https://www.visa.cn/cdn-cgi/trace](https://www.visa.cn/cdn-cgi/trace)。调试信息中包含 IP。返回的格式为 ini。

```ini
fl=783f1
h=www.visa.cn
ip=103.219.30.12
ts=1732608640.417
visit_scheme=https
uag=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0
colo=JXG
sliver=none
http=http/2
loc=CN
tls=TLSv1.3
sni=plaintext
warp=off
gateway=off
rbi=off
kex=X25519MLKEM768
```

## 国外

如果配置了代理，访问国外网站就会显示代理的 IP 了。

### httpbin

[httpbin](https://github.com/postmanlabs/httpbin)是[postman](https://www.postman.com/)开发的的测试网站，提供了获取 IP 的接口[https://httpbin.org/ip](https://httpbin.org/ip)，返回格式是 json。

```json
{
  "origin": "203.198.13.125"
}
```

### ifconfig.me

[ifconfig.me](https://ifconfig.me/)提供了获取 IP 信息的接口[https://ifconfig.me/ip](https://ifconfig.me/ip)，返回格式是纯文本。

```txt
203.198.13.125
```

### ipwhois

[ipwhois](https://ipwhois.io/)提供了获取 IP 信息的接口[https://ipwho.is/](https://ipwho.is/)，返回格式是 json。

```json
{
  "About Us": "https://ipwhois.io",
  "ip": "203.198.13.125",
  "success": true,
  "type": "IPv4",
  "continent": "Asia",
  "continent_code": "AS",
  "country": "Hong Kong",
  "country_code": "HK",
  "region": "Hong Kong",
  "region_code": "",
  "city": "Hang Hau",
  "latitude": 22.3172623,
  "longitude": 114.2672828,
  "is_eu": false,
  "postal": "",
  "calling_code": "852",
  "capital": "City of Victoria",
  "borders": "CN",
  "flag": {
    "img": "https://cdn.ipwhois.io/flags/hk.svg",
    "emoji": "🇭🇰",
    "emoji_unicode": "U+1F1ED U+1F1F0"
  },
  "connection": {
    "asn": 4760,
    "org": "Hong Kong Telecommunications hkt Limited Mass Internet",
    "isp": "Pccw Ims Limited",
    "domain": "pccw.com"
  },
  "timezone": {
    "id": "Asia/Hong_Kong",
    "abbr": "HKT",
    "is_dst": false,
    "offset": 28800,
    "utc": "+08:00",
    "current_time": "2024-11-26T16:16:28+08:00"
  }
}
```

### claude 和 chatgpt

[chatgpt](https://chatgpt.com/)和[claude](https://claude.ai/)都使用了`cdn-cgi`:

- [https://chatgpt.com/cdn-cgi/trace](https://chatgpt.com/cdn-cgi/trace)。
- [https://claude.ai/cdn-cgi/trace](https://claude.ai/cdn-cgi/trace)。

这个可以用来测试代理分流（使用 AI 接口时最好使用美国节点）。

### 其他`cdn-cgi`

[discoard](https://discord.com/)：[https://discord.com/cdn-cgi/trace](https://discord.com/cdn-cgi/trace)。

### cloudflare

毫不意外的，[cloudflare](https://www.cloudflare.com/)本身也使用了`cdn-cgi`：[https://www.cloudflare.com/cdn-cgi/trace](https://www.cloudflare.com/cdn-cgi/trace)。

另外，cloudflare 的测速网站也提供了 IP 信息：[https://speed.cloudflare.com/meta](https://speed.cloudflare.com/meta)，返回格式是 json。

```json
{
  "hostname": "speed.cloudflare.com",
  "clientIp": "203.198.13.125",
  "httpProtocol": "HTTP/1.1",
  "asn": 4760,
  "asOrganization": "Netvigator",
  "colo": "HKG",
  "country": "HK",
  "latitude": "22.29080",
  "longitude": "114.15010"
}
```

### ip-api

[ip-api](http://ip-api.com)提供了网址：[http://ip-api.com/json/](http://ip-api.com/json/)，格式为 json。

```json
{
  "status": "success",
  "country": "Hong Kong",
  "countryCode": "HK",
  "region": "KKT",
  "regionName": "Kwun Tong",
  "city": "Kowloon Bay",
  "zip": "",
  "lat": 22.3327,
  "lon": 114.2116,
  "timezone": "Asia/Hong_Kong",
  "isp": "Hong Kong Telecommunications (HKT) Limited Mass Internet",
  "org": "Hong Kong Telecommunications (HKT) Limited",
  "as": "AS4760 HKT Limited",
  "query": "203.198.13.125"
}
```

## 附录

参考：

- [html.zone](https://html.zone/ip)。
- [gist from leafsummer](https://gist.github.com/leafsummer/3891afc4c9f8e49bc9cbd6b590aee9dd)。
