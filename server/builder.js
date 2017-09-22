/*
* @Author: insane.luojie
* @Date:   2017-09-21 10:38:02
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-22 12:49:33
*/

import Tappable from "tappable";
import _ from 'lodash';
import chokidar from 'chokidar';
import webpack from 'webpack';
import debug from "debug";
import {remove, mkdirp} from "fs-extra";

import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackDevServer from "webpack-dev-server";

import Options from "./options";
import MFS from 'memory-fs'
import {r, sequence} from "./utils";
import webpackConfig from "./config/base";
import dllWebpackConfig from "./config/dll";
import pify from 'pify'

import vueLoaderConfig from './config/vue-loader.config'
import styleLoader from './config/style-loader'

import Generator from "./generator";

debug.color = 2 // Force green color

const STATUS = {
  INITIAL: 1,
  BUILD_DONE: 2,
  BUILDING: 3
}

export default class Bulder extends Tappable {
	constructor () {
		super();
    this.options = Options.create({});

    // Fields that set on build
    this.compiler = null
    this.webpackDevMiddleware = null
    this.webpackHotMiddleware = null

        // Mute stats on dev
    this.webpackStats = this.options.dev ? false : {
      chunks: false,
      children: false,
      modules: false,
      colors: true,
      excludeAssets: [
        /.map$/,
        /index\..+\.html$/,
        /vue-ssr-client-manifest.json/
      ]
    }

    // Bind styleLoader and vueLoader
    this.styleLoader = styleLoader.bind(this)
    this.vueLoader = vueLoaderConfig.bind(this)

    this._buildStatus = STATUS.INITIAL
	}

	async build () {
    if (this._buildStatus === STATUS.BUILD_DONE && this.options.dev) {
      return this
    }

    if (this._buildStatus === STATUS.BUILDING) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.build())
        }, 1000)
      })
    }

    this._buildStatus = STATUS.BUILDING

    // Create .nuxt/, .nuxt/components and .nuxt/dist folders
    await remove(r(this.options.buildDir))
    await mkdirp(r(this.options.buildDir, 'components'))

    await this.generateRoutesAndFiles();

    // Start webpack build
    await this.webpackBuild()

    await this.applyPluginsAsync('built', this);

    // Flag to set that building is done
    this._buildStatus = STATUS.BUILD_DONE

    return this
	}

  get plugins () {
    return []
  }

  async generateRoutesAndFiles () {
    // 生成代码 到 .blade目录
    await Generator.generate(this.options);
  }

	async webpackBuild () {
    debug('Building files...')
    const compilersOptions = []

    // Client
    const clientConfig = webpackConfig.call(this)
    compilersOptions.push(clientConfig)

    // Alias plugins to their real path
    this.plugins.forEach(p => {
      const src = this.relativeToBuild(p.src)

      // Client config
      if (!clientConfig.resolve.alias[p.name]) {
        clientConfig.resolve.alias[p.name] = src
      }
    })

    // Make a dll plugin after compile to make next dev builds faster
    if (this.options.build.dll && this.options.dev) {
      compilersOptions.push(dllWebpackConfig.call(this, clientConfig))
    }

    // Simulate webpack multi compiler interface
    // Separate compilers are simpler, safer and faster
    this.compiler = { compilers: [] }
    this.compiler.plugin = (...args) => {
      this.compiler.compilers.forEach(compiler => {
        compiler.plugin(...args)
      })
    }

    // Initialize shared FS and Cache
    const sharedFS = this.options.dev && new MFS()
    const sharedCache = {}

    // Initialize compilers
    compilersOptions.forEach(compilersOption => {
      const compiler = webpack(compilersOption)
      if (sharedFS && !compiler.name.includes('-dll')) {
        compiler.outputFileSystem = sharedFS
      }
      compiler.cache = sharedCache
      this.compiler.compilers.push(compiler)
    })

    // Access to compilers with name
    this.compiler.compilers.forEach(compiler => {
      if (compiler.name) {
        this.compiler[compiler.name] = compiler
      }
    })

    // Run after each compile
    this.compiler.plugin('done', async stats => {
      // Don't reload failed builds
      /* istanbul ignore if */
      if (stats.hasErrors()) {
        return
      }

      // console.log(stats.toString({ chunks: true }))

      await this.applyPluginsAsync('done', { builder: this, stats })
    })

    // Add dev Stuff
    if (this.options.dev) {
      this.webpackDev()
    }

    await this.applyPluginsAsync('compile', { builder: this, compiler: this.compiler })

    // Start Builds
    await sequence(this.compiler.compilers, compiler => new Promise((resolve, reject) => {
      if (this.options.dev) {
        // --- Dev Build ---
        if (compiler.options.name === 'base') {
          // Client watch is started by dev-middleware
          resolve()
        } else if (compiler.options.name.includes('-dll')) {
          // DLL builds should run once
          compiler.run((err, stats) => {
            if (err) {
              return reject(err)
            }
            debug('[DLL] updated')
            resolve()
          })
        } else {
          // Build and watch for changes
          compiler.watch(this.options.watchers.webpack, (err) => {
            /* istanbul ignore if */
            if (err) {
              return reject(err)
            }
            resolve()
          })
        }
      } else {
        // --- Production Build ---
        compiler.run((err, stats) => {
          /* istanbul ignore if */
          if (err) {
            console.error(err) // eslint-disable-line no-console
            return reject(err)
          }

          // Show build stats for production
          console.log(stats.toString(this.webpackStats)) // eslint-disable-line no-console

          /* istanbul ignore if */
          if (stats.hasErrors()) {
            return reject(new Error('Webpack build exited with errors'))
          }
          resolve()
        })
      }
    }))
    await this.applyPluginsAsync('compiled', this)
  }

  webpackDev () {
    debug('Adding webpack middleware...')
    // Create webpack dev middleware
    this.webpackDevMiddleware = pify(webpackDevMiddleware(this.compiler.base, Object.assign({
      publicPath: this.options.build.publicPath,
      stats: this.webpackStats,
      noInfo: true,
      quiet: true,
      watchOptions: this.options.watchers.webpack
    }, this.options.build.devMiddleware)))

    this.webpackHotMiddleware = pify(webpackHotMiddleware(this.compiler.base, Object.assign({
      log: false,
      heartbeat: 10000
    }, this.options.build.hotMiddleware)))

    const server = new webpackDevServer(this.compiler.base, {
      stats: false,
      // 根据配置修改
      historyApiFallback: true,
      hot: true,
      // proxy
      
    });

    server.use(this.webpackDevMiddleware);
    server.use(this.webpackHotMiddleware);

    server.listen(this.options.port, '127.0.0.1', () => {});

    // Start watching files
    this.watchFiles()
  }

  watchFiles () {
    // 监控 pages 目录 ，更新route.js文件
    
  }
}