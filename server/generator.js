/*
* @Author: insane.luojie
* @Date:   2017-09-20 15:05:33
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 14:41:37
*/

import _ from "lodash";
import {readFile, writeFile, mkdirp, utimes} from "fs-extra";
import {dirname, resolve} from "path";
import { createRoutes, wp, wChunk, r, relativeTo } from "./utils";
import glob from "glob";
import hash from 'hash-sum';
import debug from "debug";

const files = [
	"app.js",
	"router.js",
	"components.js",
	"plugins.js",
	"store.js",
	"views/app.html",
	"layouts/404.vue"
]

/**
 * 获取 route 文件
 */
async function getRoutes(opts) {
	let files = glob.sync('pages/**/*.vue', { cwd: opts.srcDir });
  opts.router.routes = createRoutes(files, opts.srcDir);
}

/**
 * 获取module 文件
 */
async function getModules(opts) {
	let files = glob.sync('modules/*/index.vue', { cwd: opts.srcDir });
	//
	opts.runtime.modules = [];
}

/**
 * 获取components 文件
 */
async function getComponents(opts) {
	let files = glob.sync('components/*/index.vue', { cwd: opts.srcDir });
	opts.runtime.components = files.map((item) => {
		/components\/(.+)\/index/.exec(item);
		return {
			name: RegExp.$1,
			path: item
		}
	});
}

export default {
	async generate (opts) {
		debug("> 生成路由...");
		getRoutes(opts);

		getModules(opts);
		getComponents(opts);

		const context = {
			opts,
			dev: opts.dev,
			router: opts.router,
			debug: opts.debug || false,
			uniqBy: _.uniqBy
		}

		function relativeToBuild(path) {
			return relativeTo(opts.buildDir, path);
		}

		const sources = files.map((file) => {
			return {
				name: file,
				src: resolve(opts.bladeDir, file),
				dest: file
			}
		})

		return await Promise.all(sources.map(async ({name, src, dest}) => {
			// 获取文件内容
			const fileContent = await readFile(src, 'utf-8');
			let content = '';
			if (/\.html$/.test(src)) {
				content = fileContent;
			} else {
				const templateOption = {
					imports: {
						relativeToBuild: relativeToBuild,
						hash,
	          r,
	          plugins: opts.plugins,
	          components: opts.runtime.components,
	          modules: opts.runtime.modules,
	          opts,
	          wp,
	          wChunk,
					}
				};
				const template = _.template(fileContent, templateOption);
				content = template(context);
			}

			const path = resolve(opts.buildDir, dest);
			await mkdirp(dirname(path));

			await writeFile(path, content, 'utf-8');
			const dateFS = Date.now() / 1000 - 1000
			return utimes(path, dateFS, dateFS)
		}))
	}
}