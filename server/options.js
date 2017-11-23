/*
 * @Author: insane.luojie
 * @Date:   2017-09-20 11:52:45
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-22 12:16:15
 */
import { join, resolve, sep } from "path";
import { existsSync } from "fs";
import _ from "lodash";
import { isUrl, isPureObject, relativeTo } from "./utils";
const pkg = require(resolve('package.json'));

const _default = {
    version : pkg.version,
	mode: "spa",
	host: "127.0.0.1",
	port: 8080,
	buildDir: ".blade",
	bladeDir: resolve(__dirname, "../app"),
	dev: process.env.NODE_ENV !== "production",
	build: {
		publicPath: "/",
		filename: "",
		chunkFilename: "",
		cssSourceMap: false,
		extractCSS: true,
		dll: false,
		pretty: false,
		postcss: {}
	},
	appTemplatePath: "",
	layout: {
		main: "./layouts/app"
	},
	runtime: {},
	babel: {},
	eslint: {},
	addons: {},
	html: {
		analytic: ""
	},
	css: [],
	plugins: [],
	// global resource
	resources: [],
	tilte: "blade",
	watchers: {
		webpack: {
			ignored: /-dll/
		},
		chokidar: {}
	},
	release: {
		dir: "dist"
	},
	views: {
		notFound: "./layouts/404.vue"
	},
	vendors: [],
	type: "mobile",
	router: {
		mode: "history",
		linkActiveClass: "b-link-active",
		linkExactActiveClass: "b-c-link-active",
		fallback: false,
		base: "/"
	}
};

function loadWebConfig() {
	const path = resolve(".", "web.config.js");
	if (existsSync(path) && require.cache[path]) {
		delete require.cache[path];
	}
	return require(path);
}

export default {
	create(_opts) {
		const _conf = loadWebConfig();

		const opts = Object.assign({}, _opts, _conf);

		let overriderNotFound = false;
		if (opts.views && opts.views.notFound) {
			overriderNotFound = true;
		}

		_.defaultsDeep(opts, _default);

		// 如果native打包，强制使用 router.mode = 'hash'; todo

		// 设置根目录
		opts.rootDir = _opts.rootDir ? _opts.rootDir : process.cwd();
		opts.srcDir = _opts.srcDir
			? join(opts.rootDir, _opts.srcDir)
			: opts.rootDir;
		opts.buildDir = resolve(opts.rootDir, opts.buildDir);
		opts.cacheDir = join(opts.buildDir, ".cache");

		if (overriderNotFound) {
			opts.views.notFound = relativeTo(
				opts.buildDir,
				join(opts.rootDir, opts.views.notFound)
			);
		}

		const _postcss = {
			sourceMap: opts.build.cssSourceMap,
			plugins: {
				// https://github.com/postcss/postcss-import
				"postcss-import": {
					root: opts.rootDir,
					path: [opts.srcDir, opts.rootDir]
				},
				// https://github.com/postcss/postcss-url
				"postcss-url": {},
				// http://cssnext.io/postcss
				"postcss-cssnext": {}
			}
		};

		if (opts.type == "mobile") {
			_postcss.plugins["postcss-pxtorem"] = {
				rootValue: 20,
				minPixelValue: 2,
				replace: false,
				propList: ["*"]
			};
		}

		// Postcss
		_.defaultsDeep(opts.build.postcss, _postcss);

		opts.build.postcss.plugins = Object.keys(
			opts.build.postcss.plugins
		).map(p => {
			const plugin = require(p);
			return plugin(opts.build.postcss.plugins[p]);
		});

		// 获取 babel, eslint 设置
		opts.babelOptions = _.defaults(opts.babel, {
			babelrc: false,
			cacheDirectory: !!opts.dev
		});
		if (!opts.babelrc && !opts.babel.presets) {
			opts.babelOptions.presets = [
				require.resolve("babel-preset-vue-app")
			];
		}

		// If app.html is defined, set the template path to the user template
		opts.appTemplatePath = resolve(opts.buildDir, "views/app.html");
		if (existsSync(join(opts.srcDir, "app.html"))) {
			opts.appTemplatePath = join(opts.srcDir, "app.html");
		}

		return opts;
	}
};
