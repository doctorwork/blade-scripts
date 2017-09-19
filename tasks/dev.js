/*
* @Author: insane.luojie
* @Date:   2017-09-02 00:46:35
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-19 11:58:41
*/

const Server = require("../server");
const {join, resolve} = require("path");

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const dir = resolve('.');
const server = new Server({dev: true});
