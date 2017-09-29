/*
* @Author: insane.luojie
* @Date:   2017-09-18 18:36:03
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 11:49:33
*/

const WebpackDevServer = require('webpack-dev-server');
import PagesPlugin from "../plugins/pages";
import {resolve, join} from "path";
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import { isUrl, urlJoin } from '../utils';
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import {createLoaders} from "./loader";

/**
 * webpack plugins
 * @type {Array}
 */
let plugins = [
  new webpack.IgnorePlugin(/(precomputed)/, /node_modules.+(elliptic)/),
  new ProgressBarPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    filename: 'vendor.[hash:8].js',
    minChunks: 2
  }),
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
      name: 'manifest',
      minChunks: Infinity,
      filename: 'manifest'
    }),
    new ExtractTextPlugin({
      filename: 'style.css'// this.options.build.filenames.css
    })
    // new webpack.DllReferencePlugin({
    //   context: this.options.rootDir,
    //   manifest: require(join(this.options.cacheDir, "./manifest.json"))
    // })
  ]);

  const rules = createLoaders.call(this);

  let webpackConfig = {
    entry: {
      main: resolve(this.options.buildDir, 'app'),
      vendor: ["vue", "vue-router", "vuex", "lodash"]
    },
    output: {
      path: resolve(this.options.buildDir, 'dist'),
      filename: 'app.[chunkhash:8].js',
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
        'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1,
        'static': join(this.options.srcDir, 'static'),
        'lodash': require.resolve('lodash'),
        'axios': require.resolve("axios"),
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
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`up and running here http://127.0.0.1:${this.options.port || 8080}${this.options.router.base}`]
        },
      }),
    )
  } else {
    webpackConfig.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        extractComments: {
          filename: 'LICENSES'
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
