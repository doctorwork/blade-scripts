/*
 * @Author: insane.luojie
 * @Date:   2017-09-18 18:36:03
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-09 19:56:11
 */

import { resolve, join } from "path";

import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import ProgressBarPlugin from 'progress-bar-webpack-plugin'
import webpack from "webpack";
import HTMLPlugin from "html-webpack-plugin";
import { isUrl, urlJoin } from '../utils';
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { createLoaders } from "./loader";
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import { error, isObject } from "util";
import _ from "lodash";

/**
 * webpack plugins
 * @type {Array}
 */
let plugins = [
    // new webpack.IgnorePlugin(/(precomputed)/, /node_modules.+(elliptic)/),
    new ProgressBarPlugin()
];

export default function baseConfig() {
    const nodeModulesDir = join(__dirname, '..', '..', '..', 'node_modules')
    const HTMLPluginConfig = Object.assign({
        filename: 'index.html',
        template: this.options.appTemplatePath,
        inject: true,
        title: this.options.title,
        chunksSortMode: 'dependency'
    }, {
        base: this.options.router.base || '/'
    });

    let envVars = Object.assign({
        'PRODUCTION': process.env.NODE_ENV == 'production',
        'process.env.NODE_ENV': process.env.NODE_ENV
    }, this.options.env.default, this.options.env[process.env.NODE_ENV]);

    const envs = {};
    _.forEach(envVars, (val, key) => {
        envs[key] = JSON.stringify(val);
    })

    plugins = plugins.concat([
        new HTMLPlugin(HTMLPluginConfig),
        new webpack.DefinePlugin(envs),
        new ExtractTextPlugin({
            filename: 'css/style.[chunkhash:8].css' // this.options.build.filenames.css
        })
    ]);

    const entry = {
        main: resolve(this.options.buildDir, 'app')
    }

    if (this.options.build.dll) {
        plugins.push(
            new webpack.DllReferencePlugin({
                context: this.options.rootDir,
                // The path to the manifest file which maps between
                // modules included in a bundle and the internal IDs
                // within that bundle
                manifest: resolve(this.options.cacheDir, 'vendor-manifest.json'),
            }))
    } else {
        entry.vendor = this.vendors();
        let reg = new RegExp(this.vendors().join('|'));
        plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                minChunks: function(module, count) {
                    return module.context && module.context.indexOf("node_modules") !== -1 && reg.test(module.context);
                },
                minChunks: Infinity
            })
        )
    }

    const rules = createLoaders.call(this);

    let webpackConfig = {
        entry,
        output: {
            path: resolve(this.options.buildDir, 'dist'),
            filename: '[name].[hash:8].js',
            chunkFilename: '[name].[chunkhash:8].js',
            publicPath: (isUrl(this.options.build.publicPath) ?
                this.options.build.publicPath :
                urlJoin(this.options.router.base, this.options.build.publicPath))
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
                'lodash': 'lodash'
            }
        },
        resolveLoader: {
            modules: [
                'node_modules',
                nodeModulesDir
            ]
        },
        devtool: this.options.dev ? 'cheap-eval-source-map' : 'hidden-source-map'
    }

    if (this.options.dev) {
        webpackConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new FriendlyErrorsWebpackPlugin({
                compilationSuccessInfo: {
                    messages: [`up and running here http://127.0.0.1:${this.options.port || 8080}${this.options.router.base}`]
                }
            })
        )
    } else {
        webpackConfig.plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                output: {
                    comments: false
                },
                parallel: true,
                uglifyOptions: {
                    ie8: true,
                    ecma: 6,
                }
            })
        )
    }

    // 处理dll plugin
    return webpackConfig;
}