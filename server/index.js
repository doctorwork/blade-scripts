/*
* @Author: insane.luojie
* @Date:   2017-09-18 16:40:02
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-19 14:09:07
*/

const fs = require('fs');
const chalk = require('chalk');
import createCompiler from "./webpack";
const express = require("express");
const webpackDevServer = require("webpack-dev-server");

module.exports = function Server ({ dir = '.', dev = false}) {
	const compiler = createCompiler({ dir, dev });
	const server = new webpackDevServer(compiler, {
	  stats: {
	    colors: true
	  }
	});

	server.listen(8080, '127.0.0.1', () => {
	  console.log('Starting server on http://localhost:8080');
	});

	return server;
}