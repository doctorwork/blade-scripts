import chokidar from "chokidar";
import _ from 'lodash';
import { r } from "./utils";

/**
 * 监控文件目录
 * pages web.config.js
 * @return {} 
 */
function startWatcher () {
	const patterns = [
    r(this.options.srcDir, 'store/index.js'),
    r(this.options.srcDir, 'modules/**/index.vue'),
    r(this.options.srcDir, 'components/**/index.vue'),
    r(this.options.srcDir, 'pages/**/*.vue'),
    r(this.options.srcDir, 'web.config.js')
  ]

  const options = Object.assign({}, this.options.watchers.chokidar, {
    ignoreInitial: true
  })

  const refreshFiles = _.debounce(() => this.generateRoutesAndFiles(), 500)

	// 重新生成代码
  let filesWatcher = chokidar.watch(patterns, options)
    .on('add', refreshFiles)
    .on('unlink', refreshFiles)

}

export default startWatcher;