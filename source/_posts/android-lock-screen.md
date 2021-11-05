---
title: Android6.0锁屏源码分析之界面布局分析
date: 2017-04-19 20:06:09
description: 大致介绍一下锁屏界面
tags: 
- android
- computer science
categories: 
- computer science
---
先大致介绍一下锁屏界面，Android的锁屏界面可以分为两级：

1. 一级锁屏界面暂且称之为锁屏界面*LockScreen*

    即平常用到的无需任何输入和验证，只需滑动解锁，没有任何的安全性可言，只是为了防止因为非故意触发手机造成的一定的困扰。

2. 二级锁屏界面是在解锁一级界面后进入的一个界面*UnlockScreen*

    算是用于一定的加密，相当于给手机多了一层保护，所以二级界面通常称之为安全界面-----KeyguardSecurityView。要想解锁该界面就需要输入一定的验证信息，图案，密码，pin码等等各种加密方式。但也不要以为有了这个界面你的手机就有很好的加密性了，这种很好消除和破解。

**锁屏界面LockScreen**

{% asset_img lockscreen.png "锁屏界面" %}

Android6.0的原生的锁屏界面如上，上滑解锁。
刚开始看到这个，确实不知道该如何去分析，不知道该界面到底隶属于谁。这时候就要借助sdk的工具了。
当然，如果你对framework层源码很熟悉的话也可以从代码角度来分析，该界面是在按下power电源键KEYCODE_POWER灭屏之后加载出来的，而不是说每次在灭屏状态下按键亮屏时再加载。根据这个逻辑，就要去看按键按下灭屏之后的处理，可以从PhoneWindowManager看起，在该类中有对Power按键的处理。

如果从代码角度这么追的话可能需要花费的时间或多一些，建议还是直接使用sdk查看view视图的工具，直接就可以定位到该锁屏界面。
{% asset_img hierarchyviewer.png "hierarchyviewer" %}

该工具可以显示出来当前显示的是哪一个界面，以及该界面的view视图，可以帮助很好的分析锁屏。借助该工具可以看到，锁屏界面对应的是StatusBar。
{% asset_img hierarchyviewer2.png "hierarchyviewer" %}

可以看出，锁屏界面属于状态栏，属于SystemUi的一部分，类似于状态栏下拉之后的界面，而Android4.4.2是属于keyguard锁屏界面。
说的直白一点儿就是，6.0的锁屏界面就是状态栏下拉后的一个界面，准确来说是状态栏加载出来的一个View(也可以说是组)，解锁只需要上滑。Android4.4.2的锁屏界面隶属于keyguard，与statusBar没有关系，就是一个界面。
借助sdk工具，可以分析锁屏界面上你想分析的所有小部件，先看工具中显示的view视图的一小部分。
{% asset_img viewer.png "view" %}

介绍一下代码所在位置，有需要改布局的或者锁屏相关的可以参考根据界面view的id/notification_panel。
可以找到锁屏界面整体的xml文件为status_bar_expanded.xml文件，文件所在目录为\android\frameworks\base\packages\SystemUI\res\layout\status_bar_expanded.xml，研究源码要借助源码搜索工具--openGrok可以很快的找到所搜索的内容在整个源码中使用的地方。

用一张图可以很清晰的看出各个部件的id：
{% asset_img layout.png "layout" %}

如果想要针对锁屏的布局或者某个小控件做修改的话可以按照这张图标注的id进行查找对应的view或者layout文件。
有了布局分析图后你现在可以进行基本的布局相关的调整工作了，比如隐藏某个view，更改某个view的样式，添加view，等等

举个例子，我现在对底部的那三个按钮感兴趣，那么我就直接去找keyguard_bottom_area.xml文件（
文件目录在\android\frameworks\base\packages\SystemUI\res\layout\status_bar_expanded.xml），各个按钮的id我需要知道
{% asset_img layout2.png "layout2" %}

要求一，滑动相机view时不进行任何操作
目前6.0源码中是在滑动照相机这个view一段距离后，会自动调起来相机应用。我现在不让他调起相机应用，而是开启别的应用，怎
么做？

首先是分析既然是针对相机view的操作，那我们首先研究一下相机view滑动一段距离后怎么调起的相机应用。相应的可以直接把相机
应用替换成我们自己的应用，这样每当view滑动一段距离后就会调起自己想要调起的应用。所以首先是找到调起相机应用的地方

```java
@Override  
public void onClick(View v) {  
    if (v == mCameraImageView) {  
        launchCamera(CAMERA_LAUNCH_SOURCE_AFFORDANCE);  
...
```

在KeyguardBottomAreaView.java中有关于按钮点击后打开相机的操作，代码目录为
\android\frameworks\base\packages\SystemUI\src\com\android\systemui\statusbar\phone\KeyguardBottomAreaView.Java
也就是说，你想让点击相机view之后做什么操作，只需要修改这里即可，至于相机应用如何起来的，可以根据代码流程就行分析，在
这里不多介绍。
电话view与相机view属于同一类型的view，同属于com.android.systemui.statusbar.KeyguardAffordanceView。点击事件也在该
onClick方法中。

要求二，目前是上滑解锁，如何不让其上滑解锁
这个首先需要分析一下上滑这个动作在哪儿监听的，然后何时会调用解锁？按照这个思路分析了一下午，也没理出个头绪，幸而得到
一些指点，既然整个界面是个自定义的view，那么可以考虑对view屏蔽掉触摸事件，即在view的onTouchEvent中规定，当满足某种
条件时向上滑动不解锁，这样看来，省去了很多事。
可能有时候解决问题就是这样，没有必要去死钻牛角尖非要数到小数点才肯罢休。但如果是想学习研究的话确实可以看一看。

要求三，定制某个按键，长按解锁
Android6.0锁屏有一个特点，那就是在一级锁屏界面状态下长按menu键可以解锁。所以针对第三个要求，可以在锁屏页进行按键分
发时进行一个判断，满足条件后调用menu菜单解锁的处理
做法如下

```java
@Override  
public boolean dispatchKeyEvent(KeyEvent event) {  
    ...
    // 如果按键抬起，且为长按事件  
    if (event.getAction() == KeyEvent.ACTION_UP &&(event.getFlags() & KeyEvent.FLAG_LONG_PRESS) == 0) {  
        int keyCode = event.getKeyCode();  
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0){  
            // 判断按键，并进行解锁操作，mLongPress线程里调用的是按下menu键解锁的方法  
            // mKeyguardView.handleMenuKey()；  
  
            mHandler.removeCallbacks(mLongPress); 
            return true; 
        }
    } 
    return super.dispatchKeyEvent(event); 
}    
```

二级界面-----keyguardSecurity安全界面
{% asset_img unlockscreen.png "unlockscreen" %}

这就是所谓的安全界面，需要输入密码，在解锁了一级界面后如果设置了密码就会进入到二级界面，仿照一级界面的分析方法来分析二级界面。

从现在开始，才开始是锁屏相关的界面，锁屏模块代码目录如下
{% asset_img foldertree.png "foldertree" %}

对于二级界面有6中情况

```java
/** 
* 
*根据不同的模式获取到不同的布局 
 */  
private int getLayoutIdFor(SecurityMode securityMode) {  
    switch (securityMode) {  
        case Pattern: return R.layout.keyguard_pattern_view;  
        case PIN: return R.layout.keyguard_pin_view;  
        case Password: return R.layout.keyguard_password_view;  
        case SimPin: return R.layout.keyguard_sim_pin_view;  
        case SimPuk: return R.layout.keyguard_sim_puk_view;  
        default:  
            return 0;  
    }  
}  
```

各种模式的定义在KeyguardSecurityMode.java中文件路径为android/frameworks/base/packages/Keyguard/src/com/android/keyguard/KeyguardSecurityMode.java

```java
public enum SecurityMode {  
    Invalid, // NULL state  所设置的状态无效  
    None, // No security enabled  没有设置二级界面，即一级界面解锁后直接进入主屏幕  
    Pattern, // Unlock by drawing a pattern. 通过绘制图案解锁  
    Password, // Unlock by entering an alphanumeric password 输入密码解锁，该密码包括字母和数字  
    PIN, // Strictly numeric password 输入纯数字密码解锁  
    SimPin, // Unlock by entering a sim pin. 输入sim卡pin码解锁  
    SimPuk // Unlock by entering a sim puk，输入sim卡puk码解锁，该码是唯一的，当sim卡密码输入pin码错误次数  
        //过多时会需要输入puk码，每个手机卡有自己的puk码即ID由运营商提供  
}
```

不同的模式与布局文件一一对应，

对于布局上想要修改的，就去找对应的那几个布局文件即可，在这里不再举例说明。。

对于锁屏界面的布局就分析到这里了，有什么宝贵意见的大神们可以甩出来，是一个学习的过程。

在完结了锁屏界面布局分析之后，接下来的博客就要对锁屏的加载即显示锁屏、解锁一级界面，解锁二级界面进行一个详细分析了。
感觉工程量好大。慢慢来吧~~