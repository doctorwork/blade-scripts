"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @Author: insane.luojie
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @Date:   2017-09-18 18:36:47
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @Last Modified by:   insane.luojie
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @Last Modified time: 2017-09-19 18:11:22
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */


var _fs = require("fs");

var _path = require("path");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin');

var MemoryFileSystem = require('memory-fs');
// var memoryFs = new MemoryFileSystem();

var PagesPlugin = function () {
	function PagesPlugin() {
		_classCallCheck(this, PagesPlugin);
	}

	_createClass(PagesPlugin, [{
		key: "apply",
		value: function apply(compiler) {
			var root = (0, _path.resolve)(".");
			// memoryFs.mkdirpSync(root);
			var memoryFs = compiler.inputFileSystem;
			// let content = readFileSync(resolve(__dirname, "../../app/app.js")).toString();
			// setup file system
			// MemoryFileSystem.prototype.writeFileSync.call(memoryFs, resolve(root, "app.js"), content, 'utf-8');
			// 
			// memoryFs.writeFileSync(resolve(root, "app.js"), content, 'utf-8');
			// compiler.inputFileSystem = memoryFs;
		}
	}]);

	return PagesPlugin;
}();

exports.default = PagesPlugin;