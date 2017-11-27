/*
 * @Author: insane.luojie
 * @Date:   2017-09-02 00:46:41
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-27 17:15:08
 */
const Server = require("../server");
const args = require("minimist")(process.argv.slice(2));
// 解析 -env 参数
// npm run build -- --env=qa
const env = args.env || "production";
import { writeJson } from "fs-extra";
import { join } from "path";

process.env.NODE_ENV = env || "production";
process.env.BABEL_ENV = process.env.NODE_ENV;
console.log("> env: ", env, "\n");

const server = Server({ dev: false }).then(({ dir, data }) => {
	const [compilation] = data.children;
	// console.log("data: ", compilation.assets);
	const assets = compilation.assets
		.filter(item => !item.name.match(/(map|html)$/))
		.map(item => item);

	const content = {
		hash: data.hash,
		assets
	};

	writeJson(join(dir, "dist", "manifest.json"), content, err => {
		if (err) return console.error(err);
		console.log("> manifest generated");
	});
});
