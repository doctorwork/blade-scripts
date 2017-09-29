/*
* @Author: insane.luojie
* @Date:   2017-09-02 00:46:35
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 11:31:02
*/

const Server = require("../server");

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const server = new Server({dev: true});
