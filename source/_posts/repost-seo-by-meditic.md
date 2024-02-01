---
title: "[转自meditic]seo科普"
date: 2024-02-02 00:12:01
tags:
description: 在推上看到一篇seo的科普，觉得不错，转一下。
---
本文转自推特上[meditic](https://twitter.com/meditic)发的[推](https://twitter.com/meditic/status/1752845300165906613)。

很多出海开发者都关心SEO的话题，作为今天破1000粉的福利，我把去年给一个加拿大客户做的web方案里的SEO部分提炼了一下要点、并针对 
[@jeff_uubs](https://twitter.com/jeff_uubs)的问题做了一些改动，贴在下面了：

首先，SEO 分为两种：A）中国的SEO； B）SEO

## A、先快速说第一种：针对中国的SEO 🤮

中国的搜索引擎，我认为更像是广告引擎。对于预算有限的小团队，我不建议针对百度等广告引擎做优化，因为规则不透明，回报不稳定。

如果你主打中国市场且预算有限，我的两个建议：

### 1）放弃传统的业务关键字策略 

由于中国广告引擎的本质，靠业务关键字，在国内想要不花钱还能排得靠前是很艰难的。但是品牌名搜索的竞争烈度就很低了。

可以取一个相对生僻、冷门但好记的品牌名，然后确保使用国内IP的网站里没有其它人使用类似的名字；那么，当潜在的国内客户直接搜索你品牌名的时候，有较大的概率可以出现在第一页。

比如我在国内有个SaaS产品，一直以英文品牌示人，一来可以用英文快速筛选掉一些文盲用户，二来，这个英文名虽然在海外有很多同名产品，但是这些产品的服务器都不在中国，因此国内的搜索结果里也不会优先推荐它们，因此，只要有人搜那个英文，我的产品往往都能占据前三。

### 2）尝试一下小红书 

据我了解，小红书在国内是最接近搜索引擎的产品，因为小红书是一个重视内容沉淀的产品。最近我也拿了一个新产品去尝试了两周，投入很低，但效果很显著。

至于抖音和微信，分发逻辑不一样，更偏好“新鲜度”和“廉价多巴胺”，而不是内啡肽。无论多么辛苦创造的优质内容，生命周期最多10天，因此我个人不太推荐。

---------------------

## B、针对中国以外的正常SEO 🍻

这部分内容稍微有点长，建议加书签后慢慢看。

针对Google的搜索优化，新网站的第一年，可以按下面三个策略来规划：

- 1）Technical SEO；
- 2）Keywords & Quality Content;
- 3）Monitoring & Optimization

简单说一下每个部分：

### 1）Technical SEO 🛠️

相对来说，这是比较简单的部分，可以迅速把网站提升到60分，让 google 感觉你是一个值得被认真对待的网站。

具体来说，包括以下优化：内容结构的清晰度；HTML标签的可读性和语义化；URL结构优化；页面内容的Canonicalization；Sitemap设置；内链不要出错；启用HTTPS；手机端的自适应；优化 LCP、FID、CLS 等前端渲染问题；静态文件的体积优化；服务器访问速度的优化；等等。

相关的入门文章：
- http://backlinko.com/technical-seo-guide
- http://blog.hubspot.com/marketing/technical-seo-guide

Technical SEO是投资回报比最高的部分，一周就可以入门，几周时间就可以完成施工。 有一堆免费工具可以帮你，比如： 
- http://pagespeed.web.dev
- http://seositecheckup.com
- http://seoptimer.com
- http://search.google.com/search-console

需要补充的是，对于SEO业内人士来说，Technical SEO其实有很多细节需要关注，比如域名的历史活动、域名何时会到期、同一个 IP 下的网站数量等，对于搜索结果都会有影响。对于我的新项目，我甚至会在网站的技术栈都还没选好的时候，就已经提前几个月开始执行 Pre-launch SEO了。

如果有兴趣了解这些犀利且有用的细节，推荐关注一些北美SEO圈子的专业人士，他们的 Newsletter 是我每周必看的内容。

留个hook：如果本帖超过 500 个书签/收藏，我会公布我订阅的Newsletter列表。

### 2）Keywords & Quality Content 🎯

巧妇难为无米之炊，没有优质内容是很难做 SEO 的。这里又有一个前提：创作优质内容之前需要先敲定关键字(keywords)，否则就是漫无目的的瞎创作。

实际上，google 的排名针对的是每一个网页（page），而不是整个网站（site）。虽然我们看到的搜索结果往往是网站居多，但实际上这只是这个域名下的首页（index page），本质上还是一个网页。

所以，在我们的实践里，会对不同的网页做不同的关键字优化。比如 
[@jeff_uubs](https://twitter.com/jeff_uubs)说要做 AI 生成照片的业务，那么我可能会考虑做下面几个主题的内容：

/articles/AI-create-passport-photos
/articles/AI-create-profile-photos
/articles/AI-create-instagram-photos
/articles/AI-create-photos-with-celebrities
... 等等

然后每一篇文章的内容，也是针对相应的关键字去做后续优化。比如，/articles/AI-create-instagram-photos 这篇文章可以去联系跟 instagram 强相关的其他网站，付费让他们转载你的文章、建立外链等，把它们已经建立的跟instagram的相关性传递到你的网页里。

Keywords Research 是一个专业技能，其核心原则是要找到“跟你业务相关、且搜索量较大、且竞争烈度比较低”的关键字。如果某些关键字的竞争烈度超级高，就意味着你即使很努力也不会有什么收获，那么放弃这个竞争也许是最划算的。所以，实操起来需要很多取舍，有兴趣可以找一些课程去学习。

常用的关键字研究工具：https://lowfruits.io

关于内容创作，第一个caveat就是首先要分清楚“内容”和“优质内容”的区别。

我的建议是：可以使用 AI 协助，但绝对不要把 AI 喷出的文章直接拿去用。道理很简单，一篇花了 10 秒钟用AI喷出的文章，和一篇花了一周时间写的 5000 字以上、包含大量图表和专业洞察的深度文章，google 是很容易判断出来的。

什么是“优质内容”的标准？可以参考 SEO 大佬 [@BrianEDean](https://twitter.com/BrianEDean)的满分范文：
https://backlinko.com/content-marketing-this-year 

门槛较低的内容创作，就是撰写跟你的品牌业务相关的文章（比如行业趋势、同行的工具对比、客户使用的成功案例等），从不同角度写个 10 篇深度文章是不难的。

每隔2~3周发一篇到自己的网站里， 每篇都要及时提交到 Google Search Console里，用尽各种工具让 google 尽快索引到，建立起原创者的首发优势。索引完成后，再前往 https://medium.com 等特别受到 google 青睐的高分平台去发布文章前70%的内容，然后底部带上你的原始文章的链接，再次向 google 强调你才是原创者。

如果你实在没有时间搞优质内容，有个平替方案：先用 AI 喷出一篇，然后你自己花 1 小时优化一下内容（比如去掉明显的错误），然后花 200 美元左右去 upwork 上找同行业里的职业copywriter去改写。10 篇文章可能会花掉两万人民币，但是长远来看，可能会是你回报率最高的一笔投资。同样的两万人民币，按照广告业大部分 CPC 的价格只能一次性买来几千个劣质访问量。

无论copywriter还是自己写，记得都要送入 https://gptzero.me 检查，反复修改，确保 AI 痕迹低于 40% 再发。

完成这一步之后，你的SEO成绩应该可以达到70分了。

如果你没有专职的团队成员做SEO，那么到这一步就差不多了。因为第三步属于进阶玩法，需要的精力和技能投入是比较大的。

### 3）Monitoring & Optimization 📈

第三步，进阶任务。

这部分门槛最低的是：发掘更多的长尾关键字、并进行对应的优质内容创作。

举个例子，还是以这个 AI 照片工具为例。最近北美对于用 AI 做 Image Upscale 比较火，那么你可以发一篇叫 /articles/free-AI-image-upscalers-2024 的深度评测文章；

再比如，前段时间里有个 upscaler 工具叫 Magnific AI，我试用过其实效果挺差的，但营销做的真不错。那么你可以发一个  /articles/magnific-AI-alternatives 甚至 /articles/magnific-AI-free-coupon 来瓜分竞争对手的流量。

如果还有余力，可以花半年时间搞一下 Link Building，要从80 分提升到 90 分就离不开它。这又是一门非常独立的技能，可以免费做，但很花时间，也比较慢；如果要快 ，北美有一堆 Link Building Agency 可以帮你，但需要根据你的行业，深入研究对比后才能甄别出哪些是靠谱的。

如何从 90 分提升到 95 分？方法很多，但都离不开长期的数据监测和优化，不仅监测自己的数据，还要监测竞争对手的数据，每一次排名变化都是有原因的。综合性的监测工具方面，业内用的比较多的是 https://semrush.com 和 https://ahrefs.com 。两者很接近，但我基于一些细小的差异买了 semrush。近期我在测试 https://wope.com ，是否推荐要等以后再说。

此外，每年都有一些新的SEO机会出现，比如 2023 年圈内比较流行的是Programmatic SEO, Parasite SEO，最早做的一批人已经搞了百万级的免费流量了，如何成为最早的那批人？如果让我来回答，还是优质的RSS 和 Newsletter 最靠谱。

说实话，进阶任务的执行非常依赖对SEO行业有系统性的了解，这也是大部分的 SEO Agency 可以收你几万刀服务费的主要原因。

如果有时间，建议先系统性地学一些 SEO 课程。以下课程跟我没有利益关系，请根据预算自行选择：
- https://semrush.com/academy/courses/seo/
- https://yoast.com/academy/free-seo-training-seo-for-beginners/
- https://hubspot.com/resources/courses/seo
- https://coursera.org/specializations/seo
- https://clickminded.com

学完后，你会发现 SEO 是一个涉及到很多细节的系统性工程，从前期规划到实施到收割成果往往需要半年起步，需要耐得住性子。

但是另一方面，SEO 又是一个杠杆超级高的技能，一旦学好了，就可以让google的几千名工程师终身为你免费打工，每天源源不断送流量进来。作为过来人，我可以证明：真的挺香的 🤣