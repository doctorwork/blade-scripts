/*
 * @Author: insane.luojie
 * @Date:   2017-09-27 10:16:06
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-28 16:45:36
 */

export function createLoaders() {
	/**
	 * loader rules
	 * @type {}
	 */
	let rules = [];

	let postcssLoader = {
		loader: "postcss-loader",
		options: this.options.build.postcss
	};

	let imgLoader = ["file-loader?limit=10000&name=imgs/[hash:7].[ext]"];

	Array.prototype.push.apply(rules, [
		{
			test: /\.json$/,
			loader: "json-loader"
		},
		{
			test: /\.js$/,
			loader: "babel-loader",
			exclude: str => {
				return (
					/node_modules/.test(str) &&
					this.options.build.babelInclude.every(
						item => !item.test(str)
					)
				);
			},
			options: this.options.babelOptions
		},
		{
			test: /\.vue$/,
			loader: "vue-loader",
			options: this.vueLoader()
		},
		{
			test: /\.css$/,
			loaders: this.styleLoader("css", [])
		},
		{
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: "url-loader",
			options: {
				limit: 1000, // 1 KO
				name: "fonts/[name].[hash:7].[ext]"
			}
		},
		{
			test: /\.styl$/,
			loaders: this.styleLoader("styl", ["stylus-loader"])
		},
		{
			test: /\.less$/,
			loaders: this.styleLoader("less", ["less-loader"])
		},
		{
			test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
			loaders: imgLoader
		}
	]);

	return rules;
}
