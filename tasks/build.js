/*
* @Author: insane.luojie
* @Date:   2017-09-02 00:46:41
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-26 11:16:28
*/

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const dir = resolve('.');
const opts = Options.create({dev: true});
const server = new Server(opts, true);