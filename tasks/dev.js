/*
* @Author: insane.luojie
* @Date:   2017-09-02 00:46:35
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-27 15:20:36
*/

const Server = require("../server");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const server = Server({ dev: true });
