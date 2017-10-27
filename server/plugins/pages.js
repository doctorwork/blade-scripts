/*
 * @Author: insane.luojie
 * @Date:   2017-09-18 18:36:47
 * @Last Modified by:   insane.luojie
 * @Last Modified time: 2017-09-19 18:11:22
 */
import {
	readFileSync
} from "fs";
import {
	resolve,
	join
} from "path";
var MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin');
var MemoryFileSystem = require('memory-fs');

export default class PagesPlugin {
	apply(compiler) {
		const root = resolve(".");
		const memoryFs = compiler.inputFileSystem;

	}
}