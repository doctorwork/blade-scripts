/*
 * @Author: insane.luojie
 * @Date:   2017-09-18 18:36:03
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-12-04 14:57:43
 */

import { resolve, join } from "path";

import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin";
import ProgressBarPlugin from "progress-bar-webpack-plugin";
import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import { isUrl, urlJoin } from "../utils";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import { createLoaders } from "./loader";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import { error, isObject } from "util";
import forEach from "lodash/forEach";
const CopyWebpackPlugin = require("copy-webpack-plugin");

export default function baseConfig() {
	let envVars = Object.assign(
		{
			PRODUCTION: process.env.NODE_ENV == "production",
			"process.env.NODE_ENV": process.env.NODE_ENV
		},
		this.options.env.default,
		this.options.env[process.env.NODE_ENV]
	);

	const envs = {};
	forEach(envVars, (val, key) => {
		envs[key] = JSON.stringify(val);
	});

	const HTMLPluginConfig = Object.assign(
		{
			filename: "index.html",
			template: this.options.appTemplatePath,
			inject: true,
			title: this.options.title,
			chunksSortMode: "dependency"
		},
		{
			base: this.options.router.base || "/"
		},
		this.options.html
	);

	let plugins = [
		new ProgressBarPlugin(),
		new HTMLPlugin(HTMLPluginConfig),
		new webpack.DefinePlugin(envs),
		// new webpack.NamedChunksPlugin(),
		new ExtractTextPlugin({
			filename: "css/style.[contenthash:8].css" // this.options.build.filenames.css
		})
	];

	const nodeModulesDir = join(__dirname, "..", "..", "..", "node_modules");

	const entry = {
		main: resolve(this.options.buildDir, "app")
	};

	if (this.options.build.dll) {
		plugins.push(
			new webpack.DllReferencePlugin({
				context: this.options.rootDir,
				manifest: resolve(this.options.cacheDir, "vendor-manifest.json")
			})
		);
	} else {
		entry.vendor = this.vendors();
		let reg = new RegExp(this.vendors().join("|"));
		plugins.push(
			new webpack.optimize.CommonsChunkPlugin({
				name: "vendor",
				minChunks: function(module, count) {
					return (
						module.context &&
						module.context.indexOf("node_modules") !== -1 &&
						reg.test(module.context)
					);
				},
				minChunks: Infinity
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name: ["runtime"],
				filename: this.options.dev
					? "runtime.[hash:8].js"
					: "runtime.[chunkhash:8].js"
			}),
			new CopyWebpackPlugin([
				{
					from: resolve(
						this.options.srcDir,
						this.options.build.contentBase
					),
					to: resolve(this.options.buildDir, "dist")
				}
			])
		);
	}
	const rules = createLoaders.call(this);

	let webpackConfig = {
		entry,
		output: {
			path: resolve(this.options.buildDir, "dist"),
			filename: "[name].[chunkhash:8].js",
			chunkFilename: "[name].[chunkhash:8].js",
			publicPath: isUrl(this.options.build.publicPath)
				? this.options.build.publicPath
				: urlJoin(
						this.options.router.base,
						this.options.build.publicPath
					)
		},
		plugins,
		name: "base",
		module: {
			rules
		},
		resolve: {
			modules: ["node_modules", nodeModulesDir],
			extensions: [".js", ".vue", ".json", ".less", ".ts"],
			alias: {
				static: join(this.options.srcDir, "static"),
				"~": join(this.options.srcDir),
				"@": resolve(this.options.buildDir),
				vue$: "vue/dist/vue.esm.js", // 'vue/dist/vue.common.js' for webpack 1,
				lodash: "lodash"
			}
		},
		resolveLoader: {
			modules: ["node_modules", nodeModulesDir]
		},
		devtool: this.options.dev ? "inline-source-map" : "hidden-source-map"
	};

	if (this.options.dev && this.options.devtool) {
		webpackConfig.devtool = this.options.devtool;
	}

	if (this.options.dev) {
		webpackConfig.plugins.push(
			new webpack.HotModuleReplacementPlugin(),
			new FriendlyErrorsWebpackPlugin({
				compilationSuccessInfo: {
					messages: [
						`up and running here http://127.0.0.1:${this.options
							.port || 8080}${this.options.router.base}`
					]
				}
			})
		);
	} else {
		webpackConfig.plugins.push(
			new webpack.HashedModuleIdsPlugin(),
			new webpack.optimize.UglifyJsPlugin({
				sourceMap: true,
				output: {
					comments: false
				},
				parallel: true,
				uglifyOptions: {
					ie8: true,
					ecma: 6
				}
			})
		);
	}

	// 处理dll plugin
	return webpackConfig;
}
