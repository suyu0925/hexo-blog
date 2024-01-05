---
title: 工作累了吗，来点类型体操放松一下吧
date: 2024-01-05 11:06:52
tags:
- typescript
description: 高质量的Typescript类型可以提高项目的可维护性并避免一些潜在的漏洞，但提升这方面的能力很不容易，type challenges就是一个极佳的练习场。
---
321，上链接：[type-challenges](https://github.com/type-challenges/type-challenges)。

它通过[@type-challenges/utils](https://www.npmjs.com/package/@type-challenges/utils?activeTab=code)包实现了类型检查，这样就可以直接在[ts playground](https://www.typescriptlang.org/play)中运行。你可以点击[Hello World](https://tsch.js.org/13/play/zh-CN)感受一下。

拿**简单**难度的[最后一个元素](https://tsch.js.org/15/play/zh-CN)来举个例子：
```typescript
/* _____________ 你的代码 _____________ */

type Last<T extends any[]> = any

/* _____________ 测试用例 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Last<[2]>, 2>>,
  Expect<Equal<Last<[3, 2, 1]>, 1>>,
  Expect<Equal<Last<[() => 123, { a: string }]>, { a: string }>>,
]
```

可以有很多解法，比如正统的
```typescript
type Last<T extends unknown[]> = T extends [...infer _, infer L] ? L : never
```
或者调皮一点的
```typescript
type Last<T extends unknown[]> = [any, ...T][T["length"]]
```

它提供了简单、中等、困难、地狱4个难度的题目，涉及array、object、number、infer、template等方面。开心的去玩耍吧。
