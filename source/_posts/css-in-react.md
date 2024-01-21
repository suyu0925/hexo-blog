---
title: css在react中的进化史
date: 2024-01-21 23:27:12
tags:
description: 相比vue中简洁自然的css解决方式，css一直是react的痛。本文试着回顾一下react上流行的各种解决方案。
---
首先看一下传统html标准下的css解决方案的不足。

1. 全局样式容易造成命名冲突，特别是使用第三方库时。
2. 在web开发组件化的大势下，css语言对组件化。
3. 样式与状态相关的情况越来越多，需要能访问组件状态的动态样式。

## BEM

为了避免命名冲突，早在2006年，[yandex](https://yandex.com/company/)就发明了[BEM](https://en.bem.info/methodology/quick-start/)。

BEM是一种css命名规范，它的核心思想是将css的命名空间划分为三个部分：块（block）、元素（element）和修饰符（modifier）。

```css
.opinions-box {
    margin: 0 0 8px 0;
    text-align: center;

    &__view-more {
        text-decoration: underline;
    }

    &__text-input {
        border: 1px solid #ccc;
    }

    &--is-inactive {
        color: gray;
    }
}
```

使用BEM可以很大程度上避免命名冲突，并且能够很好的表达组件的结构。但它仍然是全局的，所以它只能成为一个规范而不是解决方案。

## react原生方案

react提供的方案是[className和inline style](https://react.dev/reference/react-dom/components/common#applying-css-styles)属性。

```jsx
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```

虽然这里的style的类型定义是[csstype](https://github.com/frenic/csstype)的`CSS.Properties<string | number>`，但其实react并不支持css中的媒体查询和伪类。

## 第一代css in js

虽然可以通过嵌套css选择器或者使用BEM来避免命名冲突，但这都不彻底。为了能彻底解决这个问题，大约在2014年出现了第一代css in js：[jss](https://cssinjs.org/)。

jss的实现原理很简单：当样式转换成css时，它会产生一个唯一的类名挂载在style标签下（可使用document.styleSheets命令查看），用户可以完全不用担心命令冲突。

而且因为它是使用js在运行时生成css，所以可以依据组件状态来动态生成。同时，jss还支持媒体查询和伪类。

```jsx
import { createUseStyles } from 'react-jss'
const useStyles = createUseStyles({
    title: {
        font: {
            size: 40,
            weight: 900
        },
        "&:hover": {
            opacity: 0.5,
        },
        color: ({ theme }) => theme.color
    },
})
const Comp = () => {
  const [theme] = useState({ color: 'red' })
  const classes = useStyles({ theme })
  return <p className={classes.title}>hello world</p>
}
```

css in js一下子就解决了上面提到的全部三个问题，但它也不是银弹：
- 因为是运行时生成的，自然也就无法使用css预处理器和postcss等工具链；
- 如果css依赖的状态变化得很频繁，可能会导致性能问题；
- 可读性和可复用性都不如css；

## css module

jss是在运行时生成css，在css in js大步发展的同时，在构建时生成css的方案也出现了，这就是[css module](https://github.com/css-modules/css-modules/blob/master/README.md)。

在2015年由webpack的[css-loader](https://github.com/webpack-contrib/css-loader)提出并实现。

css module是一个默认作用域为局部的css模块文件。它在构建时，会将css中的类名转换成唯一的类名，然后在js中导出一个对象，对象的key是原来的类名，value是转换后的类名。

```css
/* style.css */
.className {
  color: green;
}
```

```javascript
import styles from './style.css';

element.innerHTML = '<div class="' + styles.className + '">';
```

最终打包出来的css类名就是一长串hash值：
```css
._2DHwuiHWMnKTOYG45T0x34 {
  color: green;
}
```
代码中引用的`styles.className`就是`_2DHwuiHWMnKTOYG45T0x34`。

因为是构建时生成的，所以css module可以使用css预处理器和postcss等工具链。比如[babel-plugin-react-css-modules](https://github.com/gajus/babel-plugin-react-css-modules)可以让`className`不必一定为驼峰命名，可以为传统的`class-name`形式。

css module完美的解决了命名冲突和组件化的问题，但因为它是构建时生成的静态css，所以无法使用状态来动态生成样式。

但很多时候我们其实并不需要连续的样式，绝大多数情况下离散的样式已经能满足需求。

比如我们需要根据错误的数量来改变错误提示的颜色，我们用jss可以这样写：
```jsx
const useStyles = createUseStyles({
    prompt: {
        color: ({ errorCount }) => `color-mix(in hsl, red ${(errorCount + 5) * 10}%, black)`
    },
})
const Comp = () => {
  const classes = useStyles({ errorCount })
  return <p className={classes.prompt}>there are {errorCount} errors.</p>
}
```

但其实我们只分了6级，完全可以定义6个类名，然后根据错误数量来动态添加类名：
```css
.red0 {
    color: color-mix(in hsl, red 50%, black);
}
/* ... */
.red5 {
    color: color-mix(in hsl, red 100%, black);
}
```

```jsx
return <p className={classes['red' + Math.min(errorCount, 5)]}>there are {errorCount} errors.</p>
```

类似`red0`到`red5`这样的类，可以称之为原子化的css。原子化的css可以很好的解决动态样式的问题，而且它的可读性和可复用性都很好。

## 原子化css

原子化css的思想是将css样式拆分成最小的单元，然后通过组合来实现样式的复用。

最早由雅虎在2015年提出[Atomic CSS](https://acss.io/)这个概念。后来由[tailwindcss](https://tailwindcss.com/)发扬光大。

原子化css的兴起，正是因为组件化。有了组件来负责原子化css的封装，我们就可以隔离原子化css的复杂性。

```jsx
const Button = ({ children, color }) => (
    <a className=`f6 link dim br1 ba bw2 ph3 pv2 mb2 dib ${color}` href="#0">{children}</a>
)
```

使用如下：

```jsx
<Button color='hot-pink'> 注册 </Button>
```

## 第二代css in js

在jss之后，css in js的发展又迎来了第二代，这一代的代表是[emotion](https://emotion.sh/)。在它之前还有[styled-components](https://styled-components.com/)和[styled-jsx](https://github.com/vercel/styled-jsx)。

### 模板字符串

es6引入了模板字符串，这使得css in js的实现变得更加简单，写法更接近css。

```jsx
import { css } from '@emotion/css'

const color = 'white'

render(
  <div
    className={css`
      padding: 32px;
      background-color: hotpink;
      font-size: 24px;
      border-radius: 4px;
      &:hover {
        color: ${color};
      }
    `}
  >
    Hover to change color.
  </div>
)
```

### 更简便的API

emotion提供了更简便的styled API。

```jsx
import styled from '@emotion/styled'

const Button = styled.button`
  padding: 32px;
  background-color: hotpink;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
  &:hover {
    color: white;
  }
`

render(<Button>This my button component.</Button>)
```

### 支持ssr

react 16加入了ssr支持，css in js也需要与时俱进。[styled components](https://styled-components.com/docs/advanced#server-side-rendering)、[styled-jsx](https://github.com/vercel/styled-jsx#server-side-rendering)和[emotion](https://emotion.sh/docs/ssr)都支持ssr。
