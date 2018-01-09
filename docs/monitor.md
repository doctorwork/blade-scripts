# 监控

## 操作 handler
    -check      检查某个版本是否存在
    -create     创建一个版本
    -delete     删除一个版本
    -upload     上传sourceMap到一个版本，全部替换。

## 参数 Param
    -host                   sentry服务器地址
    -project                sentry项目名称
    -token                  安全令牌，可以在左下角设置
    -dns                    dns服务器地址
    -SENTRY_PROJECT_BASE    上传的sourceMap文件的base地址

## sentry 配置(web.config.js)
```js
addons : {
    sentry : {
        host : 'https://sentry.doctorwork.com',
        project : 'doctorwork/urine-backend',
        token : 'c8fbffa8fdc7465bb032865ac565d3b0a6b12c3ae237441babb31e04c5d34f33',
        dns : 'https://0ba6c03c901048ca850a3d0ad8a10c3a@sentry.doctorwork.com/7'
    }
}
env : {
    SENTRY_PROJECT_BASE : "https://web-dev.doctorwork.com"  
}
```
## 指令操作（优先与配置）
```js
npm run <blade source> -- --action=<handler> <Param>
```

## 操作 handler

### sourcemap release version 检查

```shell
npm run <blade source> -- --action=check 
npm run <blade source> -- --action=check --SENTRY_PROJECT_BASE=https://web-dev.doctorwork.com
npm run <blade source> -- --action=check --SENTRY_PROJECT_BASE=https://web-dev.doctorwork.com --version  // 检查指定版本是否存在
```
### sourcemap release 创建
```shell
npm run <blade source> -- --action=create 
npm run <blade source> -- --action=create --SENTRY_PROJECT_BASE=https://web-dev.doctorwork.com
npm run <blade source> -- --action=create --SENTRY_PROJECT_BASE=https://web-dev.doctorwork.com --version  // 创建指定版本
```

### sourcemap release 删除

```shell
npm run <blade source> -- --action=delete 
npm run <blade source> -- --action=delete --SENTRY_PROJECT_BASE=https://web-dev.doctorwork.com
npm run <blade source> -- --action=delete --SENTRY_PROJECT_BASE=https://web-dev.doctorwork.com --version  // 删除指定版本
```

### sourcemap files 上传

```shell
npm run <blade source> -- --action=upload 
npm run <blade source> -- --action=upload --SENTRY_PROJECT_BASE=https://web-dev.doctorwork.com
npm run <blade source> -- --action=upload --SENTRY_PROJECT_BASE=https://web-dev.doctorwork.com --version  // 上传到指定版本
```
## 备注：
```
1. <blade source>   项目中在package.json 中自己设置的指令名称，例如："sentry" : "blade source"
```