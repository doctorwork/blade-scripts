# 混合开发

## 协议

### init - ( 初始化 )

```js
params: {
	cache: true; // 离线缓存，默认开启
	callback_name: "window.hybrid_callbacks"; // 回调名称
}
```

### forward - (push 页面 )

* params.type 默认 h5， 可以不传
* params.url 必传
* params.title 导航栏标题

```js
    params: {
        type: "h5",         // native时 url 为页面名称字符串
        url: "/h5",
        title: "首页"，
        animate: false   // 默认为 true, 有动画 ， 可以不传
    }
```

### back - ( 返回上一页 )

* params.step 返回步数

```js
params: {
	step: -1; // 默认为 1, -1表示native navigation 最顶层
}
```

### modal - (modal 页面 )

* params.type 默认 h5， 可以不传
* params.url 必传
* params.title 导航栏标题
* params.anmite 动画放下
* params.size modal 窗口尺寸

```js
    params: {
        type: "h5",         // native时 url 为页面名称字符串
        url: "/h5",
        title: "首页"，
        animate: 'down',   // 无： none, up:从上往下 left: 从左往右 right: 从右往左, 默认为down
        size: 50%,          // 默认 100%
    }
```

### header - ( 导航栏 )

* params.title 必传，但可以为空字符串
* params.show 是否显示 默认为 true
* params.left/params.right 左右按钮

```js
    // icon : back/add/remove/search/detail/share

    params: {
        title: "首页",
        show: true/false,
        background: "#fff",   // transparent
        left: [{title: "返回", callback: 'callback_name_1', icon: "back"}],
        right: [{title: "确定", callback: 'callback_name_2', color: "red", icon: ""}]
    }
```

### scroll - ( 页面滚动 )

* params.enable 是否允许滚动， 默认为 true, 允许
* params.background 背景颜色

```json
    params: {
        enable: true,
        background: "#eee"
    }
```

### pageshow - ( 页面显示 )

在页面执行了 push 后，再次返回当前页面时执行

```json
{
	callback: "callback_name"
}
```

### pagehide - ( 页面进入后台，被 push 遮盖 )

在页面执行了 push 后执行

```json
{
	callback: "callback_name"
}
```

### device - ( 获取设备信息 )

返回数据

```json
//js
{
	callback: "device_callback"
}
```

```json
// 返回数据
{
	version: "", // 容器版本
	cache: {
		// 各频道缓存版本
		health: "1.9.0",
		urine: "1.2.0"
	},
	os: "ios/10.1", // 系统类型/版本
	dist: "app store", // 下载渠道
	uuid: "" // 设备 uuid
}
```

### location - ( 定位 )

```js
{
	params: {
		located: "located_callback"; // 定位成功 回调
		failed: "failed_callback"; // 失败回调 失败类型 code : 1 - 定位失败 2 - 无权限
		updated: "updated_callback"; //位置更新回调,
		precision: "normal"; // 精度 - normal 普通, high 最高
		timeout: 5000; // 默认超时 5秒，超时后执行 failed 回调
	}
}
```

```json
{
	coordate: { lat: 1001.1, long: 1222.0 },
	locale: "四川省成都市" // 可用时返回
}
```

### clipboard - ( 剪贴板 )

```json
{
	params: {
		content: "复制内容"
	}
}
```

```

```
