/*
 * @Author: insane.luojie
 * @Date:   2017-09-18 16:40:02
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-27 15:16:10
 */

const fs = require("fs");
const chalk = require("chalk");
import Render from "./render";

process.on("unhandledRejection", (reason, p) => {
	console.log("Reason: " + reason, p);
});

module.exports = async function Server({ dev }) {
	const render = new Render({ dev });
	if (dev) {
		await render.start();
	} else {
		return await render.build();
	}
};
