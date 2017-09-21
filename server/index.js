/*
* @Author: insane.luojie
* @Date:   2017-09-18 16:40:02
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-20 15:58:01
*/

const fs = require('fs');
const chalk = require('chalk');
import createCompiler from "./webpack";
const express = require("express");
const webpackDevServer = require("webpack-dev-server");
import Generator from "./generator";
import chokidar from "chokidar";

/**
 * 监控文件目录
 * pages web.config.js
 * @return {} 
 */
function startWatcher () {
	// 重新生成代码
	
}

module.exports = function Server (opts) {

	// 生成代码 到 .blade目录
	Generator.generate(opts);

	const compiler = createCompiler(opts);
	const server = new webpackDevServer(compiler, { stats: false 	});

	server.listen(8080, '127.0.0.1', () => {
	  console.log('Starting server on http://localhost:8080');
	});

	return server;
}