/*
* @Author: insane.luojie
* @Date:   2017-09-18 18:36:03
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-25 20:42:04
*/

const WebpackDevServer = require('webpack-dev-server');
import PagesPlugin from "../plugins/pages";
import {resolve, join} from "path";
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";

/**
 * entry based on entry in pages folder
 * @type {Array}
 */
let routes = [];
/**
 * 获取页面路由
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
function getPages(dir) {
  console.log(`> locating pages`);
  const pages = glob("pages/*/*.vue", {cwd: dir});
}

/**
 * webpack plugins
 * @type {Array}
 */
let plugins = [
  new webpack.IgnorePlugin(/(precomputed)/, /node_modules.+(elliptic)/),
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: ['up and running here http://localhost:8080']
    },
  }),
  new ProgressBarPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    filename: 'vendor.[hash:8].js',
    minChunks: 2
  }),
];

export default function baseConfig () {
  const nodeModulesDir = join(__dirname, '..', '..', '..', 'node_modules')
  const opts = this.options;

  plugins = plugins.concat([
    new HTMLPlugin({
      filename: 'index.html',
      template: this.options.appTemplatePath,
      inject: true,
      title: this.options.title,
      chunksSortMode: 'dependency'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(opts.dev ? 'development' : 'production')
    }),
    new PagesPlugin()
  ]);

    /**
   * loader rules
   * @type {}
   */
  let rules = [];

  let postcssLoader = {
    loader: 'postcss-loader',
    options: this.options.build.postcss
  }

  Array.prototype.push.apply(rules, [{
      test: /\.json$/,
      loader: 'json-loader'
  }, {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude (str) {
      return /node_modules/.test(str)
    },
    options: {
      babelrc: false,
      presets: ['babel-preset-vue-app'].map(require.resolve)
    }
  }, {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: this.vueLoader()
  }, {
    test: /\.css$/,
    loaders: ['file-loader', 'css-loader', postcssLoader]
  }, {
    test: /\.less$/,
    loaders: ['file-loader', 'css-loader', postcssLoader, 'less-loader']
  }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loaders: [
        'file-loader?limit=10000&name=imgs/[hash:7].[ext]',
        'image-webpack-loader'
      ]
  }]);

  let webpackConfig = {
    entry: {
      main: resolve(opts.buildDir, 'app')
    },
    output: {
      path: resolve(opts.buildDir, 'dist'),
      filename: 'app.[chunkhash:8].js',
      chunkFilename: '[name].[chunkhash:8].js'
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
        'static': join(this.options.srcDir, 'static')
      }
    },
    resolveLoader: {
      modules: [
        'node_modules',
        nodeModulesDir
      ]
    },
    devtool: this.options.dev ? 'cheap-module-source-map' : 'nosources-source-map'
  }

  if (opts.dev) {
    webpackConfig.entry.main = [
      resolve(__dirname, 'reload'),
      webpackConfig.entry.main
    ]

    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
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
  
  return webpackConfig;
}
