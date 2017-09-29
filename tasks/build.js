/*
* @Author: insane.luojie
* @Date:   2017-09-02 00:46:41
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 11:31:09
*/
const Server = require("../server");

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
// 解析参数

const server = new Server({dev: false});