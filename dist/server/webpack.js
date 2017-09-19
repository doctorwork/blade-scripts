'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCompiler;

var _pages = require('./plugins/pages');

var _pages2 = _interopRequireDefault(_pages);

var _path = require('path');

var _friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

var _friendlyErrorsWebpackPlugin2 = _interopRequireDefault(_friendlyErrorsWebpackPlugin);

var _progressBarWebpackPlugin = require('progress-bar-webpack-plugin');

var _progressBarWebpackPlugin2 = _interopRequireDefault(_progressBarWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: insane.luojie
* @Date:   2017-09-18 17:36:15
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-19 20:13:55
*/

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

/**
 * loader rules
 * @type {}
 */
var rules = [];

rules.concat([{
  test: /\.json$/,
  loader: 'json-loader'
}, {
  test: /\.js$/,
  loader: 'babel-loader'
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
var routes = [];
/**
 * 获取页面路由
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
function getPages(dir) {
  console.log('> locating pages');
  var pages = glob("pages/*/*.vue", { cwd: dir });
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
var plugins = [new webpack.IgnorePlugin(/(precomputed)/, /node_modules.+(elliptic)/), new _friendlyErrorsWebpackPlugin2.default(), new _progressBarWebpackPlugin2.default(), new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  filename: 'vendor.[hash:8].js',
  minChunks: 2
}), new webpack.HotModuleReplacementPlugin()];

function createCompiler(_ref) {
  var _ref$dev = _ref.dev,
      dev = _ref$dev === undefined ? false : _ref$dev;

  // getPages(opts.dir);
  plugins = plugins.concat([new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production')
  }), new _pages2.default()]);

  var webpackConfig = {
    entry: {
      main: [require.resolve('../app')]
    },
    output: {
      path: (0, _path.resolve)('./dist/'),
      filename: 'js/[name].[chunkhash:8].js',
      chunkFilename: 'pages/[chunkhash:8].js'
    },
    plugins: plugins,
    module: {
      rules: rules
    },
    resolve: {
      modules: ["node_modules"],
      extensions: ['.js', '.vue', '.json', '.less'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1,
      }
    }
  };

  var compiler = webpack(webpackConfig);
  return compiler;
}