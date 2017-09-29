/*
* @Author: insane.luojie
* @Date:   2017-09-26 11:55:34
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 13:28:59
*/

const components = {};
const modules = {};

<% components.forEach((item) => { %>
components['<%= item.name %>'] = require('<%= relativeToBuild(item.path) %>'); 
<% }) %>

<% modules.forEach((item) => { %>
modules['<%= item.name %>'] = require('<%= relativeToBuild(item.path) %>'); 
<% }) %>

export default {
	install (Vue) {
		// 注册 components
		Object.keys(components).forEach((item) => {
		  Vue.component(item, components[item]);
		});

		Object.keys(modules).forEach((item) => {
		  Vue.component(item, modules[item]);
		})
	}
}