# 监控

## sentry 配置(web.config.js)

```js
// 扩展
addons : {
    sentry : {
        host : 'https://sentry.doctorwork.com',
        project : 'doctorwork/urine-backend',
        base : 'https://web-dev.doctorwork.com',
        token : 'c8fbffa8fdc7465bb032865ac565d3b0a6b12c3ae237441babb31e04c5d34f33',
        dns : 'https://0ba6c03c901048ca850a3d0ad8a10c3a@sentry.doctorwork.com/7'
    }
}
```
## sourcemap release version 检查

```shell
npm run <blade source> -- --action=check 
```
## sourcemap release 创建
```shell
npm run <blade source> -- --action=create 
```

## sourcemap release 删除

```shell
npm run <blade source> -- --action=delete 
```

## sourcemap 上传

```shell
npm run <blade source> -- --action=uploade 
```
