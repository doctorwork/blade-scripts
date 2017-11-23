# 混合开发

## 协议

### forward - (push 页面 )

* params.type 默认 h5， 可以不传
* params.url 必传
* params.title 导航栏标题

```
    params: {
        type: "h5",
        url: "/h5",
        title: "首页"，
        animation: false   // 默认为 true, 有动画 ， 可以不传
    }
```

### back - ( 返回上一页 )

* params.step 返回步数

```
    params: {
        step: -1  // 默认为 1, -1表示最顶层
    }
```

### header - ( 导航栏 )

* params.title 必传，但可以为空字符串
* params.show 是否显示 默认为 true
* params.left/params.right 左右按钮

```
    params: {
        title: "首页",
        show: true/false,
        background: "#fff",   // transparent
        left: [],
        right: []
    }
```

### scroll - ( 页面滚动 )

* params.enable 是否允许滚动， 默认为 true, 允许
* params.background 背景颜色

```js
    params: {
        enable: true,
        background: "#eee"
    }
```

### pageshow - ( 页面显示 )

在页面执行了 push 后，再次返回当前页面时执行

```js
{
	callback: "callback_name";
}
```

### device - ( 获取设备信息 )

返回数据

```
    {
        version: "",                // 容器版本
        cache: {                    // 各频道缓存版本
            health: "1.9.0",
            urine: "1.2.0"
        },
        os: "ios/10.1",             // 系统类型/版本
        dist: "app store",          // 下载渠道
        uuid: ""                    // 设备 uuid
    }
```
