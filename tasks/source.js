/*
 * @Author: insane.luojie 
 * @Date: 2017-11-01 21:02:47 
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-01 21:06:41
 */
import axios from "axios";
import { join } from "path";
const dir = ".blade/dist";
const maps = glob.sync('modules/**.map', { cwd: dir });

const pkg = require.resolve('./package.json');
const token = "";
const version = pkg.version;
const url = `https://sentry.io/api/0/projects/:organization_slug/:project_slug/releases/${version}`;

// axios.post();