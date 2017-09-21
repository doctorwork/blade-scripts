/*
* @Author: insane.luojie
* @Date:   2017-09-20 11:52:45
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-20 16:37:41
*/
import {join, resolve} from "path";
import _ from "lodash";

const _default = {
  mode: 'spa',
	buildDir: ".blade",
	bladeDir: resolve(__dirname, "../app"),
  dev: process.env.NODE_ENV !== 'production',
  build: {

  },
  babel: {
  	presets: ['env']
  },
  eslint: {

  },
	release: {
		dir: "dist",
	},
	router: {
		mode: "history",
		base: "/",
		linkActiveClass: "b-link-active",
		linkExactActiveClass: "b-c-link-active",
		fallback: false
	}
};

export default {
	create (_opts) {

		const opts = Object.assign({}, _opts);

		_.defaultsDeep(opts, _default);
		
		// 设置根目录
		opts.rootDir = _opts.rootDir ? _opts.rootDir : process.cwd();
		opts.srcDir = _opts.srcDir ? join(opts.rootDir, _opts.srcDir) : opts.rootDir;

		// 获取 babel, eslint 设置

		return opts;
	}
}