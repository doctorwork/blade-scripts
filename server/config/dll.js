/*
* @Author: insane.luojie
* @Date:   2017-09-21 11:34:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-28 11:01:14
*/
import { resolve } from "path";

export default function dllConfig (base) {
	const name = 'vendor';
	const cacheDir = resolve(this.options.rootDir, '.cache');
	const dllDir = resolve(cacheDir, name);

	// todo 合并 vendor
	
	const conf = Object.assign({}, base, {
		name,
		entry: {
			vendor: ['vue', 'vue-router', 'vuex', 'lodash']
		},
		output: {
			path: dllDir,
			filename: '[name]_[hash].js',
			library: '[name]_[hash]'
		},
		plugins: [
			new webpack.DllPlugin({
				context: this.options.rootDir,
				// The path to the manifest file which maps between
				// modules included in a bundle and the internal IDs
				// within that bundle
				path: resolve(dllDir, 'manifest.json'),
				name: '[name]_[hash]'
			})
		]
	});

	return conf;
}