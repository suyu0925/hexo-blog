---
title: "【翻译】Web界面开发指南"
date: 2024-05-07 10:39:04
tags:
description: 在网上看到一份非常精简但实用的Web界面开发指南，翻译了一下。
---

文章源自[interfaces.rauno.me](https://interfaces.rauno.me/)，托管在[github](https://github.com/raunofreiberg/interfaces)上。以下为翻译。

## 简介

这份文档列出了一些使我们的（Web）界面更好的细节处理方式，这个列表并不是完整全面的，但它会基于经验持续不断更新。其中有些实现可能是偏于主观性的，但大多数适用于所有网站。

为了避免重复，文档中没有包含[WAI-ARIA](https://www.w3.org/TR/wai-aria-1.1/)规范的细节。不过，可能会提及一些关于可访问性的准则。我们欢迎您的贡献！您可以编辑[此文件](https://github.com/raunofreiberg/interfaces/blob/main/README.md)并提交拉取请求。

## 互动性

- 点击[输入标签](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)应该聚焦输入框
- 输入应使用[`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)包装，以便通过按`Enter`键提交
- 输入应具有适当的`type`，比如`password`、`email`等
- 大多数情况下，输入应禁用[spellcheck](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/spellcheck)和[autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete)属性
- 输入应该在适当的时候通过使用[required](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/required)属性来利用 HTML 表单验证
- 输入框前缀和后缀的装饰，例如图标，应该显示在文本输入框上层，并使用[padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding)而不是并列排版，并触发输入框的焦点。
- `Toggle`切换组件应该立即生效，不需要二次确认
- 提交表单后应禁用按钮，以避免重复的网络请求
- 交互式元素应禁用内部内容的[user-select](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select)
- 装饰元素（发光、渐变）应禁用[pointer-events](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events)以避免劫持事件
- 在垂直或水平列表中，交互元素之间不应该留有空白区域，取而代之的是，应该增加它们的`padding`。

## 字体排版

- 为了更好的可读性，字体应该设置以下样式
  - [-webkit-font-smoothing: antialiased](https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth)（针对 WebKit 内核浏览器，例如 Safari）
  - [text-rendering: optimizeLegibility](https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering)
- 根据内容、字母表或相关语言来裁剪字体 (subset fonts)
- 为了防止布局错位，字体粗细不应该在悬停或选中状态发生变化
- 字重不应该使用 400 以下的字体粗细
- 中等大小的标题通常使用 500-600 之间的字体粗细看起来最佳
- 对于标题的字体大小，可以使用[CSS clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)函数实现根据视口大小流畅调整字体的功能。例如，我们可以使用`clamp(48px, 5vw, 72px)`来设定标题的字体大小。
- 在表格中或是不希望布局发生变化的地方（比如计时器），如果可用，应该使用[font-variant-numeric: tabular-nums](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric#numeric-spacing-values)来启用表格数字 (tabular figures)。
- 使用[-webkit-text-size-adjust: 100%](https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust)防止 iOS 设备在横屏模式下文本意外缩放

## 动画

- 切换主题时不应触发元素上的过渡和动画[<sup>[1]</sup>](#refer-anchor-1)
- 动画持续时间不应超过 200ms，使交互感觉即时没有延迟
- 动画的数值应与触发器大小成比例：
  - 不要使用 0 -> 1 的缩放动画来显示对话框，而是使用淡入淡出的透明度和缩放（大约从 0.8 开始）
  - 按下按钮时，不要 1 -> 0.8，而是~0.96、~0.9 左右
- 频繁且新奇较低的动作应避免无关的动画：[<sup>[2]</sup>](#refer-anchor-2)
  - 打开右键单击菜单
  - 从列表中删除或添加项目
  - 悬停琐碎的按钮
- 循环动画在屏幕上不可见时应该暂停，以减轻 CPU 和 GPU 的使用量
- 对于在页面内导航到锚点，请使用[scroll-behavior: smooth](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior#smooth)属性，并设置适当的偏移量

## 触摸

- 悬停状态不应在触摸按下时可见，使用[@media (hover: hover)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover#hover)[<sup>[3]</sup>](#refer-anchor-3)
- 输入的字体大小不应小于 16px，以防止 iOS 缩放焦点
- 触摸设备上的输入框不应该自动聚焦，因为这会导致键盘弹出并遮挡住屏幕，影响用户体验
- 应用[muted](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#muted)和[playsinline](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#playsinline)到`<video />`标签以在 iOS 上自动播放
- 对于实现平移和缩放手势的自定义组件禁用[touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action)，以防止缩放和滚动等本机行为的干扰
- 使用[-webkit-tap-highlight-color: rgba(0,0,0,0)](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-tap-highlight-color)禁用 iOS 的默认轻触高亮效果

## 优化

- [blur()](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/blur)和[filter](https://developer.mozilla.org/en-US/docs/Web/CSS/filter)的[backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)值过大可能会导致速度变慢
- 在触摸设备上缩放和模糊填充矩形会导致条带出现，为了避免这种情况，应该使用径向渐变取代
- 对于性能不佳的动画，我们可以通过设置[transform: translateZ(0)](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translateZ)来尝试启用 GPU 渲染进行优化，但是应当谨慎使用。
- 针对性能不佳的滚动动画，我们可以通过临时启用[will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)属性来进行优化[<sup>[4]</sup>](#refer-anchor-4)
- 在 iOS 上自动播放过多视频会使设备变卡，应该暂停或卸载屏幕外的视频。
- 使用 refs 绕过 React 的渲染生命周期，实时值可以直接提交到 DOM[<sup>[5]</sup>](#refer-anchor-5)
- 检测并适应用户设备的硬件和网络能力

## 可访问性

- 禁用的按钮不应该有 tooltips，因为它们是不可访问的[<sup>[6]</sup>](#refer-anchor-6)
- 使用阴影（[box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)）来创建焦点环，而不是轮廓（[outline](https://developer.mozilla.org/en-US/docs/Web/CSS/outline)），后者无法遵循圆角样式[<sup>[7]</sup>](#refer-anchor-7)
- 顺序列表中的可聚焦元素应该可以使用`↑ 和 ↓`键导航。
- 顺序列表中的可聚焦元素应该可以使用`⌘ + Backspace`删除。
- 下拉菜单为了立即打开，应该在按下鼠标 (mousedown) 时触发，而不是点击 (click) 时触发
- 使用带有样式标签的 svg favicon，该样式标签遵循基于 prefers-color-scheme 的系统主题
- 仅图标交互元素应定义明确的 aria-label
- 由悬停触发的工具提示不应包含交互式内容
- 图像应始终使用`<img>`渲染，以供屏幕阅读器使用并方便右键菜单复制
- 使用 HTML 构建的插图应该有一个明确的 aria-label，而不是向使用屏幕阅读器的人宣布原始的 DOM 树结构
- 渐变文本应在[::selection](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection)状态下取消设置渐变
- 使用嵌套菜单时，请使用[预测锥（prediction cone）](https://bjk5.com/post/44698559168/breaking-down-amazons-mega-dropdown)来防止指针在移动到其他元素时意外关闭菜单

## 设计

- 本地乐观更新数据，服务器错误时回滚并提供反馈
- 鉴权重定向应该在服务器端完成，客户端加载之前执行，避免跳动的 URL 变化
- 使用[::selection](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection)伪类样式美化文本选中状态
- 显示与其触发器相关的反馈：
  - 复制成功时显示临时嵌入式勾选标记，而非通知
  - 表单错误时高亮显示相关输入框
- 空状态应该提示创建新项目，并可提供可选模板

## 参考

1. <span id="refer-anchor-1">在切换深色模式或浅色模式时，原本用于明确交互的元素 (例如悬停效果) 上的过渡动画也会被触发，这可能会影响用户体验。我们可以通过[临时禁用过渡动画](https://paco.me/writing/disable-theme-transitions)来解决这个问题。对于 Next.js 应用, 可以使用[next-themes](https://github.com/pacocoursey/next-themes)库，它可以开箱即用地防止切换主题时出现过渡动画。</span>
2. <span id="refer-anchor-2">审美因人而异，不过有些交互界面确实去掉了动画会更好。例如，出于频繁使用考虑， macOS 自带的右键点击菜单仅在消失时有动画效果，出现时则没有。</span>
3. <span id="refer-anchor-3">大多数触控设备在按下时会短暂地显示悬停状态，除非明确仅为使用鼠标等指针设备定义了悬停状态，可以通过媒体查询`@media (hover: hover)`实现。</span>
4. <span id="refer-anchor-4">只有在迫不得已的情况下才使用 will-change 来提升性能。为了追求性能而预先将它应用于元素上可能会产生相反的效果。</span>
5. <span id="refer-anchor-5">这句话可能会引起争议，但是有时直接操作 DOM 是有益的。例如，与其依赖 React 在每次滚动事件时都重新渲染，我们可以在 ref 中跟踪滚动量 (delta)，然后直接在回调函数中更新相关元素。</span>
6. <span id="refer-anchor-6">在 DOM 中，禁用按钮不会出现在标签顺序里，因此对于键盘使用者来说，辅助功能永远不会宣读这些按钮的悬浮提示信息。 他们也无法得知按钮被禁用的原因。</span>
7. <span id="refer-anchor-7">截至 2023 年，Safari 浏览器在定义自定义轮廓样式时，不会遵循元素的圆角属性。虽然[Safari 16.4](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes)版本已经加入了支持圆角轮廓的功能，但是请注意并非所有人都及时更新了操作系统。</span>
