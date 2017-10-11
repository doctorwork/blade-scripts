/*eslint-disable*/

import axios from "axios";
import _ from "lodash";

let config = {
	alwaysResolve: false,
	errcode: 'errcode',
	errmsg: 'errmsg'
}

/**
 * 公共请求
 * @param  {[type]} method [description]
 * @param  {[type]} url    [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function request(method, url, params) {
	const conf = { url, method };

	// 合并请求代码
	if (method == 'get') {
		conf.params = params;
	} else {
		conf.data = params;
	}

	return new Promise((resolve, reject) => {
		axios(conf)
	    .then(response => {
	      if (response.status === 200) {
          switch (response.data[config.errcode]) {
            case 0:
                resolve(response.data.data);
                break;
            default:
             reject(response.data[errmsg] || '没有数据');
          }
	      } else {
	        reject(response);
	      }
	    })
	    .catch((err) => {
	        reject(err);
	    });
	})
}

/**
 * get 请求
 */
export function $get (url, params) {
	return request('get', url, params);
}

/**
 * post 请求
 */
export function $post (url, params) {
	return request('get', url, params);
}

/**
 * 初始化 axios 配置
 * @return {} [description]
 */
export function setup (func, opts) {
	// merge with other options
	config = _.merge(config, opts);
	func && func.call(null, axios);
}
