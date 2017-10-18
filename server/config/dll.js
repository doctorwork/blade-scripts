/*
* @Author: insane.luojie
* @Date:   2017-09-21 11:34:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-28 11:01:14
*/
import { resolve, join } from "path";
import webpack from "webpack";

export default function dllConfig (base) {
	const name = 'vendor';
	const cacheDir = this.options.cacheDir;

	// todo 合并 vendor
  const nodeModulesDir = join(__dirname, '..', '..', '..', 'node_modules');
	
	const conf = Object.assign({}, base, {
		name,
		entry: {
			vendor: this.vendor()
		},
		output: {
			path: cacheDir,
			filename: '[name].[hash:8].js',
			library: '[name]_[hash]'
		},
		resolve: {
			extensions: ['.js'],
      modules: ["node_modules", nodeModulesDir],
      alias: {
	      'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1,
	      'lodash': require.resolve('lodash')
	    }
    },
		plugins: [
			new webpack.DllPlugin({
	      context: __dirname,
				// The path to the manifest file which maps between
				// modules included in a bundle and the internal IDs
				// within that bundle
				path: resolve(cacheDir, 'vendor-manifest.json'),
				name: '[name]_[hash]'
			})
		]
	});

	// 添加 production 插件

	return conf;
}