#!/usr/bin/env node

/*
 * @Author: insane.luojie
 * @Date:   2017-09-02 00:37:06
 * @Last Modified by:   insane.luojie
 * @Last Modified time: 2017-09-27 10:40:43
 */

'use strict';
const pkg = require("../package");
const path = require('path');
const spawn = require('cross-spawn');
const script = process.argv[2];
const args = process.argv.slice(3);
const existsSync = require("fs").existsSync;
const { printAndExit } = require("./utils");

const {resolve, join} = path;

process.on('unhandledRejection', err => {
    throw err;
});

const dir = resolve('.');

console.log("> blade version: ", pkg.version);
console.log(' ');

// 检查目录
if (!existsSync(join(dir, 'pages'))) {
  printAndExit('> Couldn\'t find a `pages` directory. Please create one under the project root' )
}

switch (script) {
    case 'build':
    case 'dev':
        {
            const result = spawn.sync(
                'node', [require.resolve('./tasks/' + script)].concat(args), { stdio: 'inherit' }
            );
            if (result.signal) {
                process.exit(1);
            }
            process.exit(result.status);
            break;
        }
    default:
        console.log('Unknown script "' + script + '".');
        break;
}