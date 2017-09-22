/*
* @Author: insane.luojie
* @Date:   2017-09-20 11:52:45
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-21 17:33:59
*/
import {join, resolve} from "path";
import {existsSync} from "fs";
import _ from "lodash";

const _default = {
  mode: 'spa',
  port: 8080,
	buildDir: ".blade",
	bladeDir: resolve(__dirname, "../app"),
  dev: process.env.NODE_ENV !== 'production',
  build: {
  	publicPath: "/",
  	filename: "",
  	chunkFilename: ""
  },
  appTemplatePath: "",
  babel: {
  	presets: ['env']
  },
  eslint: {

  },
  tilte: "blade",
  watchers: {
    webpack: {
      ignored: /-dll/
    },
    chokidar: {}
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

		// 设置title

		// 获取 babel, eslint 设置
    opts.babelOptions = _.defaults(opts.build.babel, {
      babelrc: false,
      cacheDirectory: !!opts.dev
    })
    if (!opts.babelrc && !opts.presets) {
      opts.babelOptions.presets = [
        require.resolve('babel-preset-env')
      ]
    }
		
	  // If app.html is defined, set the template path to the user template
	  opts.appTemplatePath = resolve(opts.buildDir, 'views/app.html')
	  if (existsSync(join(opts.srcDir, 'app.html'))) {
	    opts.appTemplatePath = join(opts.srcDir, 'app.html')
	  }

		return opts;
	}
}