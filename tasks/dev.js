/*
* @Author: insane.luojie
* @Date:   2017-09-02 00:46:35
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-20 16:33:34
*/

const Server = require("../server");
const {join, resolve} = require("path");
import Options from "../server/options";

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const dir = resolve('.');
const opts = Options.create({dev: true});
const server = new Server(opts);
