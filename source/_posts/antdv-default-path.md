---
title: Ant Design Vue Pro的默认路由
date: 2020-05-17 23:09:17
description: Ant Design Vue Pro项目是Ant Design Pro的第三方vue实现，对于vue使用者来说算是一个常见选项。<br><br>它的默认路由是/dashboard/workplace，用于自己项目时经常要改成别的，这里记录一下需要修改的几处地方，以免遗漏。
tags:
---

[Ant Design Vue Pro项目](https://github.com/vueComponent/ant-design-vue-pro)是[Ant Design Pro](https://github.com/ant-design/ant-design-pro)的第三方vue实现，对于vue使用者来说算是一个常见选项。

它的默认路由是`/dashboard/workplace`，用于自己项目时经常要改成别的，这里记录一下需要修改的几处地方，以免遗漏。

### 路由(src/config/router.config.js)

这里是第一处了，通常不会遗漏

```javascript
export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace', // <- 看这里看这里
    children: [
      // dashboard
      {
        path: 'dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
        children: [
          {
            path: 'analysis/:pageNo([1-9]\\d*)?',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false, permission: [ 'dashboard' ] }
          },
          // 外部链接
          {
            path: 'https://www.baidu.com/',
            name: 'Monitor',
            meta: { title: '监控页（外部）', target: '_blank' }
          },
          {
            path: 'workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: 'test-work',
            name: 'TestWork',
            component: () => import('@/views/dashboard/TestWork'),
            meta: { title: '测试功能', keepAlive: true, permission: [ 'dashboard' ] }
          }
        ]
      },
```

### 无权限页面(src\permission.js)

这里用的hard-code是`{ path: defaultRoutePath }`，没有使用`{ name: 'dashboard' }`，更容易出问题。

```javascript
const defaultRoutePath = '/dashboard/workplace'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: defaultRoutePath }) // <- 看这里看这里
      NProgress.done()
    } else {      
```

### Logo(src\components\tools\Logo.vue)

点击Logo回到首页，这是第二处，原作者并没有使用配置文件或其它方式来指定首页地方，而用了hard-code。

```vue
<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <LogoSvg alt="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>
```

### 异常页(src\components\Exception\ExceptionPage.vue)

在异常页的回到首页也是用的hard-code指定dashboard

```javascript
export default {
  name: 'Exception',
  props: {
    type: {
      type: String,
      default: '404'
    }
  },
  data () {
    return {
      config: types
    }
  },
  methods: {
    handleToHome () {
      this.$router.push({ name: 'dashboard' })
    }
  }
}
```

### 面包屑(src\components\tools\Breadcrumb.vue)

面包屑的“首页”。这里默认是关闭的，在打开时肯定会注意到。

```javascript
export default {
  data () {
    return {
      name: '',
      breadList: []
    }
  },
  created () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb () {
      this.breadList = []
      // this.breadList.push({name: 'index', path: '/dashboard/', meta: {title: '首页'}}) // <- 看这里看这里

      this.name = this.$route.name
      this.$route.matched.forEach(item => {
        // item.name !== 'index' && this.breadList.push(item)
        this.breadList.push(item)
      })
    }
  },
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  }
}
```
