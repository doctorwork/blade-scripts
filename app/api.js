/*eslint-disable*/

import axios from "axios";
import { omit, defaultsDeep, mapValues } from "lodash";

export const instance = axios.create();

instance.defautls = {
	timeout: 10000,
	withCredentials: true,
	headers: {
		"content-type": "application/x-www-form-urlencoded"
	}
};

// 全局配置
const requestInterceptor = instance.interceptors.request.use(config => {
	return config;
});
/**
 * 默认响应拦截
 * @param  {object} response 响应内容
 * @return {}
 */
const responseInterceptor = instance.interceptors.response.use(response => {
	switch (response.status) {
		case 200: // get - ok
		case 201: // post/put/patch - created
		case 202: // * - accepted [async task]
		case 204: // delete - no content
		case 422: // post/put/patch - unprocessable entity
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
 * @param  {object} params  请求参数
 * @return {object}
 */
function request(method, url, params = {}) {
	const conf = Object.assign(
		{
			url,
			method,
			data: {}
		},
		instance.defautls
	);

	// 合并请求代码
	if (method == "get") {
		conf.params = params;
	} else {
		conf.data = params;
	}

	return Promise.resolve(instance(conf));
}

/**
 * 初始化 axios 配置
 * @return {} [description]
 */
export function setup(opts) {
	const { interceptors } = opts;
	const defautls = omit(opts, "interceptors");

	if (interceptors && interceptors.response) {
		instance.interceptors.response.use(interceptors.response);
	}

	if (interceptors && interceptors.request) {
		instance.interceptors.request.use(interceptors.request);
	}

	// merge with other options
	instance.defautls = defaultsDeep(defautls, instance.defautls);
}

/**
 * 创建单独的请求对象
 * @param  {object} options 配置对象
 * @return {object}
 */
export const createApi = axios.create;

// 替换url中参数
function parseUrl(url, params) {
	return (
		url &&
		url.replace(/\{(\w+)\}/g, (m, n) => {
			return params[n];
		})
	);
}

function maker(method, url) {
	return function(data, params) {
		return request(method, parseUrl(url, params), data);
	};
}

export function method(method) {
	return function(url) {
		return maker(method, url);
	};
}

// 创建请求方法
export const [makeGet, makePost, makePut, makeDelete, makePatch] = [
	"get",
	"post",
	"put",
	"delete",
	"patch"
].map(item => {
	return method(item);
});

// 创建resource 请求
export function makeResource(url, actions, makers) {
	var schemas = actions || {
		get: { method: "GET", url: url + "/{id}" },
		query: { method: "GET", url },
		create: { method: "POST", url },
		update: { method: "PUT", url: url + "/{id}" },
		delete: { method: "DELETE", url: url + "/{id}" },
		patch: { method: "PATCH", url: url + "/{id}" }
	};

	const _makers = makers || {
		GET: makeGet,
		POST: makePost,
		PUT: makePut,
		DELETE: makeDelete,
		PATCH: makePatch
	};

	function initial(str) {
		return str.toLowerCase().replace(/^(\w)/, m => {
			return m.toUpperCase();
		});
	}

	return mapValues(schemas, item => {
		return _makers[item.method](item.url);
	});
}

/**
 * 错误处理方法
 * @param {function} func 需要修改方法
 * @param {function} rejector 错误时的处理方法
 */
export function decorateMaker(func, rejector) {
	return function() {
		const args = Array.from(arguments);

		return function() {
			const action = func.apply(null, args)(Array.from(arguments));
			return action.catch(rejector);
		};
	};
}
