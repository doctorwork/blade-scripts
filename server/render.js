/*
* @Author: insane.luojie
* @Date:   2017-09-28 10:49:32
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 11:57:23
*/
import _ from 'lodash';
import chokidar from 'chokidar';
import webpack from 'webpack';
import debug from "debug";
import {remove, mkdirp} from "fs-extra";
var opn = require('opn')
import watcher from "./watcher";

import webpackDevServer from "webpack-dev-server";

import Options from "./options";
import {r, sequence} from "./utils";
import webpackConfig from "./config/base";
import dllWebpackConfig from "./config/dll";

import vueLoaderConfig from './config/vue-loader.config'
import styleLoader from './config/style-loader'

import Generator from "./generator";

export default class Render {

	constructor(_opts) {
		this.options = Options.create(_opts);
		// Fields that set on build
		this.compiler = null
		this.compilers = {};
		this.webpackDevMiddleware = null
		this.webpackHotMiddleware = null

		this._env = process.env.NODE_ENV;

		// Bind styleLoader and vueLoader
		this.styleLoader = styleLoader.bind(this)
		this.vueLoader = vueLoaderConfig.bind(this)

		}

		// 创建路由，插件，组件文件
		async collectFiles () {
			// 初始化配置文件

		await remove(r(this.options.buildDir))
		await mkdirp(r(this.options.buildDir, 'components'))

		await this.generateRoutesAndFiles();

	}

	async generateRoutesAndFiles () {
		await Generator.generate(this.options);

		// 配置proxy
		console.log("> 动态文件已更新");
	}

	makeConfig (build) {
		// 初始化 app compiler
		const configs = [];
		// [webpackConfig, dllWebpackConfig].forEach((item) => {
		[webpackConfig].forEach((item) => {
			const config = item.call(this);
			configs[config.name] = config;
			if (!build) {
			  this.compilers[config.name] = webpack(config);
			}
		});
		this.compiler = this.compilers.base;
		this.configs = configs;

		if (build) {
			return webpack(Object.keys(this.configs).map((item) => {
				return this.configs[item]
			}), (err, stats) => {
				if (err) throw err
				process.stdout.write(stats.toString({
					chunks: false,
					chunkModules: true,
					colors: true,
					errors: false,
					// Add details to errors (like resolving log)
					errorDetails: true,
				}) + '\n\n')
			});
		}
	}

	/**
	 * 初始化服务器
	 * @return {[type]} [description]
	 */
	makeServer () {
		this.makeConfig();
		this.server = new webpackDevServer(this.compiler, {
			hot: true,
			stats: false,
			historyApiFallback: {
				index: this.configs.base.output.publicPath
			},
			publicPath: this.configs.base.output.publicPath
		});

		this.webpackHotMiddleware = require('webpack-hot-middleware')(this.compiler, {
		 quiet: true
		});

		this.server.use(this.webpackHotMiddleware);
	}

	// 监控文件变化
	watch () {
		watcher.call(this);
	}

	// 构建文件
	async build () {
		await this.collectFiles();

		this.makeConfig(true);
	}

	// 开启服务
	async start () {
		await this.collectFiles();

		// 初始化 dev server ? express
		this.makeServer();
		this.server.listen(this.options.port || 8080);
		this.watch();
	}
}