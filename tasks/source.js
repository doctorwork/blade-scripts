
/*
 * @Author: insane.luojie 
 * @Date: 2017-11-01 21:02:47 
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-01 21:06:41
 */
const Server = require("../server");
const args = require("minimist")(process.argv.slice(0));
const axios = require("axios");
const request = require('request-promise');
const fs = require("fs");
const { resolve, join } = require("path");
const dir = resolve(".blade/dist");
const glob = require('glob');
const pkg = require(resolve('package.json'));
const { addons, env } = require(resolve('.', 'web.config.js'));
let version = args.version || pkg.version;
const action = args.action;
const needOptions = ["host", "project", "token", "dns", "SENTRY_PROJECT_BASE"];
const README = "可查看文档：https://github.com/doctorwork/blade-scripts/blob/develop/docs/monitor.md";
let sentry = (addons && addons.sentry) || {};
sentry.SENTRY_PROJECT_BASE = env.SENTRY_PROJECT_BASE;

// 指令参数优先
needOptions.map(item => {
    if(args[item]) sentry[item] = args[item];
});

let getFile = async (file) => {
    let _filePath = resolve(".blade/dist", file);
    console.log(_filePath)
    return await fs.createReadStream(_filePath)
}

let uploadFile = async (file) => {
    let fileStream = await getFile(file);
    request({
        method: 'POST',
        uri: `${sentry.host}/api/0/projects/${sentry.project}/releases/${version}/files/`,
        headers : { 
            Authorization : `Bearer ${sentry.token}`,
            'Content-Type' : 'multipart/form-data;'
        },
        formData: {
            name: `${sentry.SENTRY_PROJECT_BASE}/${file}`,
            file: fileStream
        }
    });
}

//检查发布版本是否存在
let checkVersion = () => {
    return new Promise((resolve, reject) => {
        return axios.get(
            `${sentry.host}/api/0/projects/${sentry.project}/releases/${version}/`,
            {
                headers : { Authorization : `Bearer ${sentry.token}` }
            }
        ).then(result => {
            console.log(`>已存在 ${sentry.project}/release/${version}`);
            resolve(true);
        }).catch(err => {
            console.log(`>不存在 ${sentry.project}/release/${version}`);
            resolve(false);
        });
    });
}
// 创建release
let createRelease = async () => {
    let isExist = await checkVersion();
    if(isExist) return false;
    console.log(`> 创建中 ${sentry.project}/release/${version}`);
    return new Promise((resolve, reject) => {
        axios.post(
            `${sentry.host}/api/0/projects/${sentry.project}/releases/`,
            {
                version: version
            }, 
            {
                headers : {
                    'Content-Type' : 'application/json',
                    Authorization : `Bearer ${sentry.token}`
                }
            }
        ).then(res => {
            console.log(`> 创建完成 ${sentry.project}/release/${version}`);
            resolve(true);
        }).catch(err => {
            console.log(`> 创建出错 ${sentry.project}/release/${version}`);
            resolve(false);
        });
    });
}

// 删除release
let deletRelease = async () => {
    let isExist = await checkVersion();
    if(!isExist) return false;
    console.log(`> 删除中 ${sentry.project}/release/${version}`);
    return new Promise((resolve, reject) => {
        return axios.delete(
            `${sentry.host}/api/0/projects/${sentry.project}/releases/${version}/`,
            {
                headers : { Authorization : `Bearer ${sentry.token}` }
            }
        ).then(res => {
            console.log(`> 删除完成 ${sentry.project}/release/${version}`);
            resolve(true);
        }).catch(err => {
            console.log(`> 删除出错 ${sentry.project}/release/${version}`);
            resolve(false);
        });
    });
}

// 上传文件
let uploadSourceMap = async () => {
    const isExist = await checkVersion();
    if(isExist){
        await deletRelease();
        await createRelease();
    }else{
        await createRelease();
    }
    console.log(`> 上传 ${sentry.project}/release/${version}\n`);
    const fileArray = glob.sync('**/*.map', { cwd: dir });
    fileArray.map( async (file) => {
        await uploadFile(file);
    });
}

// 检查参数是否设置完全
let checkOptions = () => {
    let err = [];
    if(!addons || !sentry){
        console.error(`>error：请在web.config中配置addons扩展参数！${README}`);
        return false;
    }
    needOptions.map(item => {
        if(!sentry[item]) err.push(item);
    });
    if(err.length) {
        console.error(`>error：${err.join(",")} is required！${README}`);
        return false;
    }
    else return true;
}
if(checkOptions()){
    switch(action){
        case 'create' :
            createRelease();
        break;
        case 'delete':
            deletRelease();
        break;
        case 'upload':
            uploadSourceMap();
        break;
        case 'check':
            checkVersion();
        break;
        default : break;
    }
}

