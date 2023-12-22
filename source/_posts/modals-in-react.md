---
title: 挖一下React中的对话框
date: 2023-12-22 15:02:14
tags: React
description: 一个前端UI框架肯定会有对话框，探讨一下怎么样才能用得更流畅。
---

## 引言

先来个名词解释，为什么对话框（Dialog）又被叫模态框（Modal）？

直接问 ChatGTP：

> 对话框（Dialog）和模态框（Modal）是两个相关但不完全相同的概念。它们通常在用户界面设计中使用，但含义略有不同。
>
> 1.  对话框（Dialog）：
>
>         对话框是指用户界面中弹出的小窗口，用于与用户进行交互。
>
>     对话框可以是模态的，也可以是非模态的。模态对话框阻止用户与其它界面元素进行交互，直到对话框被关闭。非模态对话框允许用户在对话框打开的同时与界面的其余部分进行交互。
>     例如，一个保存文件的对话框就是一个常见的对话框，用户需要在对话框中选择文件保存的位置和名称。
>
> 2.  模态框（Modal）：
>
>         模态框是一种特殊类型的对话框，它限制了用户与应用程序的交互，直到用户处理完模态框上的内容或关闭了模态框。
>
>     模态框在打开时阻止用户与应用程序的其余部分进行交互，通常需要用户在模态框上执行某些操作后才能继续使用应用程序的其余部分。
>     模态框的目的是强制用户关注并处理其中的信息，以确保用户完成必要的操作。
>     总体而言，对话框是一个更广泛的概念，而模态框是对话框的一种特殊形式。在实际使用中，这两个术语有时会被交叉使用，但它们的含义可能会根据上下文而有所不同。

本文讨论的是模态对话框。

## 常见用法

几乎每个 UI 框架都有对话框，比如[antd](https://ant-design.antgroup.com/components/modal-cn#modal-demo-basic)、[element](https://element.eleme.cn/#/zh-CN/component/dialog)、[mui](https://mui.com/base-ui/react-modal/#component)、[eui](https://eui.elastic.co/#/layout/modal)、[mantine](https://mantine.dev/core/modal/)、[headlessui](https://headlessui.com/react/dialog#basic-example)等等。

它们的样子都差不多，通常包含一个标题、一个内容区域和一个按钮区域，有些会将 Overlay（遮罩）也显式列出。
类似这样：

```jsx
<Modal>
  <Modal.Title />
  <Modal.Content />
  <Modal.Actions />
</Modal>
```

在使用时，通常会将 Modal 直接放在 fragment 中，通常一个变量来控制是否显示 Modal。再加上一些事件处理。
类似这样：

```jsx
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  return (
    <>
      <Modal open={isOpen} onClose={close}>
        <Modal.Title>Title</Modal.Title>
        <Modal.Content>This is a content </Modal.Content>
        <Modal.Actions>
          <Button onClick={close}>Cancel</Button>
          <Button
            onClick={() => {
              console.log("OK");
              close();
            }}
          >
            OK
          </Button>
        </Modal.Actions>
      </Modal>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
    </>
  );
}
```

## 统一处理

但这样使用，会将 Modal 与原有代码混在一起，特别是 Modal 一旦多起来就很乱，不利于维护。

这时我们会想到将 Modal 抽离出来，放在一个单独的文件中，这样就可以在需要的地方直接引入，而不用关心 Modal 的实现细节。

很自然的，我们会想到维护一个 ModalManager。

```jsx
function ModalManager() {
  const modals = useModalStore();
  return (
    <>
      {modals.map((modal) => React.createElement(modal.component, modal.props))}
    </>
  );
}
```

将`<ModalManager/>`直接放在`App`中。

在需要使用 Modal 时，直接 mutate store 中的 modals 就可以。

```jsx
function openModal({ component, ...rest }) {
  setModalStore((modals) => [
    ...modals,
    {
      component,
      props: rest,
    },
  ]);
}
```

有些 UI 框架会集成这个功能，比如[mantine](https://mantine.dev/others/modals/)。

## 更流畅的方式

但这样用起来还是要传入回调，仍然会打断逻辑。有没有更流畅的方法呢？

我们回到 Modal 的本质，它让用户跳出当前逻辑，关注并处理模态框中的信息，再回到之前的逻辑。从这个角度来看，Modal 就是一个异步操作。

我们可以将 Modal 的使用方式改为类似`async/await`的方式，这样就可以将 Modal 的使用方式与原有逻辑完全分离，不会打断原有逻辑。
用起来类似这样：

```jsx
function Page() {
  return (
    <Button onClick={() => {
      const text = await inputTextModal()
      console.log('user input', text)
    }}>open modal</Button>
  )
}
```

`inputTextModal`函数类似这样：

```jsx
function inputTextModal(title) {
  let text = "";
  return (
    (new Promise() < string) |
    (null >
      ((resolve) => {
        modals.openConfirmModal({
          title,
          content: (
            <TextInput onChange={(e) => (text = e.currentTarget.value)} />
          ),
          onCancel: () => resolve(null),
          onConfirm: () => resolve(value),
        });
      }))
  );
}
```

## Modal 带回的信息

在上面的例子中，我们只传回了一个`string | null`，代表用户输入的文字。

但实际上 Modal 还可能用来处理其它事项，比如让用户输入身份验证信息，经服务器校验后返回验证是否通过。

这两类其实是不相同的，一类传回的是静态数据，一类则是用户行为的结果。说白了就是`Modal.Actions`要不要与外界交互。

如果需要与外界交互，我们可以将`Modal.Actions`交给`content`处理。
类似这样：

```jsx
function openCaptchaModal() {
  let isOk = false
  return new Promise(resolve => {
    modals.openModal({
      title: 'Are you human?',
      content: <CaptchaModal
        onOk={
          isOk = true
          modals.closeAll()
        }
        onCancel={modals.closeAll}/>,
      onClose: () => resolve(isOk),
    })
  })
}
```

## 总结

Modal 本质上就是一个异步操作，完全可以视作一个`Promise`，这样就可以将 Modal 的使用与原有逻辑完全分离，得到一个超级流畅的体验。
