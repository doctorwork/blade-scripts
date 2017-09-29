/*
* @Author: insane.luojie
* @Date:   2017-09-20 11:52:45
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 14:43:32
*/
import {join, resolve, sep} from "path";
import {existsSync} from "fs";
import _ from "lodash";
import { isUrl, isPureObject, relativeTo } from './utils'

const _default = {
  mode: 'spa',
  port: 8080,
	buildDir: ".blade",
	bladeDir: resolve(__dirname, "../app"),
  dev: process.env.NODE_ENV !== 'production',
  build: {
  	publicPath: "/",
  	filename: "",
  	chunkFilename: "",
    cssSourceMap: false,
    extractCSS: true
  },
  appTemplatePath: "",
  runtime: {},
  babel: {
  	presets: ['env'],
    plugins: [require.resolve('babel-plugin-transform-vue-jsx')]
  },
  eslint: {

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
		dir: "dist",
	},
  views: {
    notFound: './layouts/404.vue'
  },
	router: {
		mode: "history",
		linkActiveClass: "b-link-active",
		linkExactActiveClass: "b-c-link-active",
		fallback: false
	}
};

function loadWebConfig() {
  const conf = require(resolve('.', 'web.config.js'));
  return conf;
}


export default {
	create (_opts) {
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
    opts.srcDir = _opts.srcDir ? join(opts.rootDir, _opts.srcDir) : opts.rootDir;
    opts.cacheDir = join(opts.rootDir, '.cache');

    if (overriderNotFound) {
      opts.views.notFound = relativeTo(opts.buildDir, join(opts.rootDir, opts.views.notFound));
    }
    
    // router base
    if (!opts.router.base) {
      let levels = opts.rootDir.split(sep);
      opts.router.base = "/h5/" + levels[levels.length-1] + "/";
    }

    opts.vuex = existsSync(join(opts.rootDir, 'store', 'index.js')) ? 
      relativeTo(opts.buildDir, join(opts.rootDir, 'store', 'index.js')) 
      : false;

    // Postcss
    opts.build.postcss = {
      sourceMap: opts.build.cssSourceMap,
      plugins: {
        // https://github.com/postcss/postcss-import
        'postcss-import': {
          root: opts.rootDir,
          path: [
            opts.srcDir,
            opts.rootDir,
          ]
        },
        // https://github.com/postcss/postcss-url
        'postcss-url': {},
        // http://cssnext.io/postcss
        'postcss-cssnext': {}
      }
    }

    opts.build.postcss.plugins = Object.keys(opts.build.postcss.plugins)
      .map((p) => {
        const plugin = require(p);
        return plugin(opts.build.postcss.plugins[p]);
      })

		// 获取 babel, eslint 设置
    opts.babelOptions = _.defaults(opts.babel, {
      babelrc: false,
      cacheDirectory: !!opts.dev
    })
    if (!opts.babelrc && !opts.presets) {
      opts.babelOptions.presets = [
        require.resolve('babel-preset-vue-app')
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