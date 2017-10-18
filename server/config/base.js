/*
* @Author: insane.luojie
* @Date:   2017-09-18 18:36:03
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 11:49:33
*/

import PagesPlugin from "../plugins/pages";
import {resolve, join} from "path";
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import { isUrl, urlJoin } from '../utils';
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import {createLoaders} from "./loader";
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

/**
 * webpack plugins
 * @type {Array}
 */
let plugins = [
  new webpack.IgnorePlugin(/(precomputed)/, /node_modules.+(elliptic)/),
  new ProgressBarPlugin()
];

export default function baseConfig () {
  const nodeModulesDir = join(__dirname, '..', '..', '..', 'node_modules')
  const HTMLPluginConfig = Object.assign({
    filename: 'index.html',
    template: this.options.appTemplatePath,
    inject: true,
    title: this.options.title,
    chunksSortMode: 'dependency'
  }, { base: this.options.router.base || '/' });

  const envVars = Object.assign(this.options.env.default, this.options.env[process.env.NODE_ENV]);

  plugins = plugins.concat([
    new HTMLPlugin(HTMLPluginConfig),
    new webpack.DefinePlugin(Object.assign(
      {
        'process.env.NODE_ENV': JSON.stringify(this.options.dev ? 'development' : 'production')
      }, 
      ...Object.keys(envVars).map((item) => {
        return {
          [item]: JSON.stringify(envVars[item])
        }
      })
    )),
    new PagesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ 
      names: ["common", "vendor"],
      minChunks: 3
      // minChunks: Infinity,
      // filename: 'vendor.[hash:8].js',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    new ExtractTextPlugin({
      filename: 'css/style.[chunkhash:8].css'// this.options.build.filenames.css
    })
  ]);

  const rules = createLoaders.call(this);

  let webpackConfig = {
    entry: {
      main: resolve(this.options.buildDir, 'app'),
      vendor: this.vendor()
    },
    output: {
      path: resolve(this.options.buildDir, 'dist'),
      filename: '[name].[hash:8].js',
      chunkFilename: '[name].[chunkhash:8].js',
      publicPath: (isUrl(this.options.build.publicPath)
        ? this.options.build.publicPath
        : urlJoin(this.options.router.base, this.options.build.publicPath))
    },
    plugins,
    name: "base",
    module: {
      rules
    },
    resolve: {
      modules: ["node_modules", nodeModulesDir],
      extensions: ['.js', '.vue', '.json', '.less', '.ts'],
      alias: {
        'static': join(this.options.srcDir, 'static'),
        '~': join(this.options.srcDir),
        '@': resolve(this.options.buildDir),
        'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1,
        'lodash': require.resolve('lodash')
      }
    },
    resolveLoader: {
      modules: [
        'node_modules',
        nodeModulesDir
      ]
    },
    devtool: this.options.dev ? 'cheap-module-source-map' : 'hidden-source-map'
  }

  if (this.options.dev) {
    webpackConfig.entry.main = [
      resolve(__dirname, 'reload'),
      webpackConfig.entry.main
    ]

    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`up and running here http://127.0.0.1:${this.options.port || 8080}${this.options.router.base}`]
        },
      }),
    )
  } else {
    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        extractComments: {
          filename: 'LICENSES'
        },
        uglifyOptions: {
          ie8: true,
          ecma: 6
        },
        compress: {
          warnings: false
        }
      })
    )
  }

  // 处理dll plugin
  return webpackConfig;
}
