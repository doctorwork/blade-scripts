/*
* @Author: insane.luojie
* @Date:   2017-09-26 11:55:34
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 11:58:21
*/

const components = {};
const modules = {};

<% components.forEach((item) => { %>components['<%= item.name %>'] = import '<%= relativeToBuild(item.path) %>'; <% }) %>
<% modules.forEach((item) => { %>modules['<%= item.name %>'] = import '<%= relativeToBuild(item.path) %>'; <% }) %>

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