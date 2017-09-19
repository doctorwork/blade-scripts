'use strict';

var _webpack = require('./webpack');

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: insane.luojie
* @Date:   2017-09-18 16:40:02
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-19 14:09:07
*/

var fs = require('fs');
var chalk = require('chalk');

var express = require("express");
var webpackDevServer = require("webpack-dev-server");

module.exports = function Server(_ref) {
	var _ref$dir = _ref.dir,
	    dir = _ref$dir === undefined ? '.' : _ref$dir,
	    _ref$dev = _ref.dev,
	    dev = _ref$dev === undefined ? false : _ref$dev;

	var compiler = (0, _webpack2.default)({ dir: dir, dev: dev });
	var server = new webpackDevServer(compiler, {
		stats: {
			colors: true
		}
	});

	server.listen(8080, '127.0.0.1', function () {
		console.log('Starting server on http://localhost:8080');
	});

	return server;
};