/*
 * @Author: insane.luojie
 * @Date:   2017-09-02 00:46:41
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-02 10:17:54
 */
const Server = require("../server");
const args = require("minimist")(process.argv.slice(2));
// 解析 -env 参数
// npm run build -- --env=qa
const env = args.env || 'production';

process.env.NODE_ENV = env || 'production';
process.env.BABEL_ENV = process.env.NODE_ENV;
console.log("> env: ", env, '\n');

const server = new Server({ dev: false });