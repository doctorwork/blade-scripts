/*
* @Author: insane.luojie
* @Date:   2017-09-18 18:36:47
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-19 18:11:22
*/
import { readFileSync } from "fs";
import { resolve, join } from "path";
var MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin');

var MemoryFileSystem = require('memory-fs');
// var memoryFs = new MemoryFileSystem();

export default class PagesPlugin {
	apply (compiler) {
		const root = resolve(".");
		// memoryFs.mkdirpSync(root);
		const memoryFs = compiler.inputFileSystem;
		// let content = readFileSync(resolve(__dirname, "../../app/app.js")).toString();
		// setup file system
		// MemoryFileSystem.prototype.writeFileSync.call(memoryFs, resolve(root, "app.js"), content, 'utf-8');
		// 
		// memoryFs.writeFileSync(resolve(root, "app.js"), content, 'utf-8');
		// compiler.inputFileSystem = memoryFs;
		
	}
}