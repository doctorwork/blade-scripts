/*
* @Author: insane.luojie
* @Date:   2017-09-18 16:40:02
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-25 15:07:03
*/

const fs = require('fs');
const chalk = require('chalk');
import Builder from "./builder";
const express = require("express");
const webpackDevServer = require("webpack-dev-server");
import chokidar from "chokidar";
import _ from 'lodash';
import { r } from "./utils";
/**
 * 监控文件目录
 * pages web.config.js
 * @return {} 
 */
function startWatcher () {
	const patterns = [
    r(this.options.srcDir, 'layouts'),
    r(this.options.srcDir, 'store'),
    r(this.options.srcDir, 'middleware'),
    r(this.options.srcDir, 'layouts/*.vue'),
    r(this.options.srcDir, 'layouts/**/*.vue'),
    r(this.options.srcDir, 'pages/**/*.vue')
  ]

  const options = Object.assign({}, this.options.watchers.chokidar, {
    ignoreInitial: true
  })

  const refreshFiles = _.debounce(() => this.generateRoutesAndFiles(), 200)

	// 重新生成代码
  let filesWatcher = chokidar.watch(patterns, options)
    .on('add', refreshFiles)
    .on('unlink', refreshFiles)

}

process.on('unhandledRejection', (reason, p) => {
    console.log('Reason: ' + reason, p);
});

module.exports = async function Server (opts) {
	const builder = new Builder();
	await builder.build();

	startWatcher.call(builder);
}