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
const { addons } = require(resolve('.', 'web.config.js'));
const version = pkg.version;
const source = addons.sentry;
const action = args.action;

let getFile = async (file) => {
    let _filePath = resolve(".blade/dist", file);
    console.log(_filePath)
    return await fs.createReadStream(_filePath)
}
let uploadFile = async (file) => {
    let fileStream = await getFile(file);
    request({
        method: 'POST',
        uri: `${source.host}/api/0/projects/${source.project}/releases/${version}/files/`,
        headers : { 
            Authorization : `Bearer ${source.token}`,
            'Content-Type' : 'multipart/form-data;'
        },
        formData: {
            name: `${source.base}/${file}`,
            file: fileStream
        }
    });
}
//检查发布版本是否存在
let checkVersion = async () => {
    let result = await axios.get(
        `${source.host}/api/0/projects/${source.project}/releases/${version}/`,
        {
            headers : { Authorization : `Bearer ${source.token}` }
        }
    );
    if(result.data && result.data.version) console.log(`>已存在 ${source.project}/release/${version}`);
}
// 创建release
let createRelease = async () => {
    console.log(`> 创建 ${source.project}/release/${version}`);
    await axios.post(
        `${source.host}/api/0/projects/${source.project}/releases/`,
        {
            version: version
        }, 
        {
            headers : {
                'Content-Type' : 'application/json',
                Authorization : `Bearer ${source.token}`
            }
        }
    );
}
// 删除release
let deletRelease = async () => {
    console.log(`> 删除 ${source.project}/release/${version}`);
    return await axios.delete(
        `${source.host}/api/0/projects/${source.project}/releases/${version}/`,
        {
            headers : { Authorization : `Bearer ${source.token}` }
        }
    );
}
// 上传文件
let uploadSourceMap = async () => {
    await deletRelease();
    await createRelease();
    console.log(`> 上传 ${source.project}/release/${version}\n`);
    const fileArray = glob.sync('**/*.map', { cwd: dir });
    fileArray.map( async (file) => {
        await uploadFile(file);
    });
}

switch(action){
    case 'create' :
        createRelease();
    break;
    case 'delete':
        deletRelease();
    break;
    case 'uploade':
        uploadSourceMap();
    break;
    case 'check':
        checkVersion();
    break;
    default : break;
}
