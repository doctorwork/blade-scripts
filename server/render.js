/*
 * @Author: insane.luojie
 * @Date:   2017-09-28 10:49:32
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-24 10:27:00
 */
import union from "lodash/union";
import chokidar from "chokidar";
import webpack from "webpack";
import debug from "debug";
import { remove, mkdirp } from "fs-extra";
var opn = require("opn");
import watcher from "./watcher";

import webpackDevServer from "webpack-dev-server";

import Options from "./options";
import { r, sequence, isWindows, isMac } from "./utils";
import webpackConfig from "./config/base";
import dllWebpackConfig from "./config/dll";

import vueLoaderConfig from "./config/vue-loader.config";
import styleLoader from "./config/style-loader";

import Generator from "./generator";

const miniStats = {
	modules: false,
	colors: true,
	depth: false
};

export default class Render {
	constructor(_opts) {
		this._opts = _opts;
		this.options = Options.create(this._opts);
		// Fields that set on build
		this.compiler = null;
		this.compilers = {};
		this.webpackDevMiddleware = null;
		this.webpackHotMiddleware = null;

		this._env = process.env.NODE_ENV;

		// Bind styleLoader and vueLoader
		this.babelOptions = this.options.babelOptions;

		this.styleLoader = styleLoader.bind(this);
		this.vueLoader = vueLoaderConfig.bind(this);
	}

	/**
	 * 获取第三方vendor
	 * @return {array}
	 */
	vendors() {
		return union(
			["vue", "vue-router", "vuex", "axios"],
			this.options.vendors
		);
	}

	/**
	 * 创建路由，插件，组件文件
	 * @return {[type]} [description]
	 */
	async collectFiles() {
		// 初始化配置文件
		await remove(r(this.options.buildDir));

		await this.generateRoutesAndFiles();
	}

	async generateRoutesAndFiles() {
		await Generator.generate(this.options);

		// 配置proxy
		console.log("> 动态文件已更新");
		console.log(" ");
	}

	makeConfig(build) {
		// 初始化 app compiler
		const configs = [];
		[webpackConfig].forEach(item => {
			const config = item.call(this);
			configs[config.name] = config;
		});
		this.configs = configs;

		if (build) {
			return webpack(
				Object.keys(this.configs).map(item => {
					return this.configs[item];
				}),
				(err, stats) => {
					if (err) throw err;
					process.stdout.write(stats.toString(miniStats) + "\n\n");
				}
			);
		}
	}

	async makeDll() {
		// 如果是重启，直接返回 todo
		if (!this.options.build.dll) {
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			console.log("> [dll] compiling" + "\n");
			webpack(dllWebpackConfig.call(this), (err, stats) => {
				process.stdout.write(
					stats.toString({
						modules: false,
						colors: true,
						depth: false
					}) + "\n\n"
				);
				resolve();
			});
		});
	}

	/**
	 * 初始化服务器
	 * @return {[type]} [description]
	 */
	async makeServer(restart) {
		await this.makeDll();

		this.makeConfig();
		const publicPath = this.configs.base.output.publicPath;
		const options = {
			proxy: this.options.proxy || {},
			hot: true,
			port: this.options.port,
			host: this.options.host,
			open: true,
			openPage: this.options.router.base,
			stats: "errors-only",
			historyApiFallback:
				publicPath == "/"
					? true
					: {
							index: publicPath
						},
			publicPath: publicPath
		};

		webpackDevServer.addDevServerEntrypoints(this.configs.base, options);

		this.configs.base.entry.vendor = this.vendors();

		this.compiler = webpack(this.configs.base);
		this.server = new webpackDevServer(this.compiler, options);
	}

	// 监控文件变化
	watch() {
		watcher.call(this);
	}

	/**
	 * 构建 production 文件
	 * @return {[type]} [description]
	 */
	async build() {
		await this.collectFiles();

		await this.makeDll(true);
		this.makeConfig(true);
	}

	restart() {
		this.options = Options.create(this._opts);
		console.log("> restarting");
		// 停止compiler
		this.server.close(() => {
			this.start(true);
		});
	}

	/**
	 * 开启开发服务
	 * @param  {boolean} restart 是否重启
	 * @return {[type]}         [description]
	 */
	async start(restart) {
		await this.collectFiles();
		// 初始化 dev server ? express
		await this.makeServer();
		this.server.listen(this.options.port);
		if (!restart) {
			this.watch();
		}
	}
}
