/*eslint-disable*/

import axios from "axios";
import _ from "lodash";

export const instance = axios.create();

/**
 * 默认响应拦截
 * @param  {object} response 响应内容
 * @return {}          
 */
const responseInterceptor = instance.interceptors.response.use((response) => {
	switch (response.status) {
		case 200:
			return response.data;
			break;
		default:
			return response;
			break;
	}
});

/**
 * 公共请求
 * @param  {string} method 请求方法
 * @param  {string} url    请求地址
 * @param  {object params  请求参数
 * @return {object}      
 */
function request(method, url, params) {
	const conf = { 
		url, 
		method, 
		withCredentials: true
	};

	// 合并请求代码
	if (method == 'get') {
		conf.params = params;
	} else {
		conf.data = params;
	}

	return new Promise((resolve, reject) => {
		return instance(conf)
			.then((response) => {
				resolve(response);
			});
	})
}

/**
 * 初始化 axios 配置
 * @return {} [description]
 */
export function setup (opts) {
	const { interceptors } = opts;
	const defautls = _.omit(opts, 'interceptors');

	if (interceptors && interceptors.response) {
		instance.interceptors.response.eject(responseInterceptor);
		instance.interceptors.response.use(interceptors.response);
	}

	// merge with other options
	instance.defautls =	_.defaultsDeep(defautls, {
		timeout: 10000,
		withCredentials: true
	});
}

/**
 * 创建单独的请求对象
 * @param  {object} options 配置对象
 * @return {object}         
 */
export function createApi(options) {
	return axios.create(options);
}

// 替换url中参数
function parseUrl(url, params) {
	return url && url.replace(/\{(\w+)\}/g, (m, n) => {
    return params[n];
  });
}

function maker(method, url) {
	return function (data, params) {
		return request(method, parseUrl(url, params), data);
	}
}

// 创建get 请求 路由
export function makeGet (url) {
	return maker('get', url);
}

// 创建post 请求 路由
export function makePost (url) {
	return maker('post', url);
}

// 创建post 请求 路由
export function makePut (url) {
	return maker('put', url);
}

// 创建post 请求 路由
export function makeDelete (url) {
	return maker('delete', url);
}

// 创建resource 请求
export function makeResource (url, actions, opts) {
	var schemas = actions || {
		get: { method: 'GET', url: url + "/{id}" },
		query: { method: 'GET', url },
		create: { method: 'POST', url },
		update: { method: 'PUT', url: url + "/{id}" },
		delete: { method: "DELETE", url: url + "/{id}" }
	}

	const _makers = {makeGet, makePost, makePut, makeDelete};

	function initial(str) {
		return str.toLowerCase().replace(/^(\w)/, (m) => { 
		  return m.toUpperCase()
		});
	}

	return _.mapValues(schemas, (item) => {
		return _makers['make' + initial(item.method)](item.url);
	})
}
