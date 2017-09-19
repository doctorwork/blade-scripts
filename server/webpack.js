/*
* @Author: insane.luojie
* @Date:   2017-09-18 17:36:15
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-19 20:13:55
*/

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
import PagesPlugin from "./plugins/pages";
import {resolve} from "path";
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
/**
 * loader rules
 * @type {}
 */
let rules = [];

rules.concat([{
    test: /\.json$/,
    loader: 'json-loader'
 }, {
  test: /\.js$/,
  loader: 'babel-loader',
  // exclude (str) {
  //   return /node_modules/.test(str)
  // },
  // options: mainBabelOptions
}, {
  test: /\.vue$/,
  loader: 'vue-loader'
}, {
  test: /\.css$/,
  loaders: ['style-loader', 'css-loader', 'postcss-loader']
}, {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    loader: 'file-loader',
    options: {
        limit: 10000,
        name: 'imgs/[hash:7].[ext]'
    }
}]);

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
 * require path
 * @param  {string} path 路径
 * @return {}      
 */
function relativeResolve(path) {
  return require(path);
}

/**
 * webpack plugins
 * @type {Array}
 */
let plugins = [
  new webpack.IgnorePlugin(/(precomputed)/, /node_modules.+(elliptic)/),
  new FriendlyErrorsWebpackPlugin(),
  new ProgressBarPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    filename: 'vendor.[hash:8].js',
    minChunks: 2
  }),
  new webpack.HotModuleReplacementPlugin(),
];

export default function createCompiler ({dev = false}) {
  // getPages(opts.dir);
  plugins = plugins.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
    }),
    new PagesPlugin()
  ]);

  let webpackConfig = {
    entry: {
      main: [require.resolve('../app')]
    },
    output: {
        path: resolve('./dist/'),
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: 'pages/[chunkhash:8].js'
    },
    plugins,
    module: {
      rules
    },
    resolve: {
      modules: ["node_modules"],
      extensions: ['.js', '.vue', '.json', '.less'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1,
      }
    }
  }

  let compiler = webpack(webpackConfig);
  return compiler;
}
