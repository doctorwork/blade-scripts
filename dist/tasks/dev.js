"use strict";

/*
* @Author: insane.luojie
* @Date:   2017-09-02 00:46:35
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-19 11:58:41
*/

var Server = require("../server");

var _require = require("path"),
    join = _require.join,
    resolve = _require.resolve;

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

var dir = resolve('.');
var server = new Server({ dev: true });