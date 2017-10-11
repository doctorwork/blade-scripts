/*
* @Author: insane.luojie
* @Date:   2017-09-26 11:55:34
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 13:28:59
*/
/*eslint-disable*/

<% components.forEach((item) => { %>
import <%= item.name %> from '<%= relativeToBuild(item.path) %>';
<% }) %>

<% modules.forEach((item) => { %>
import <%= item.name %> from '<%= relativeToBuild(item.path) %>';
<% }) %>

export default {
	install (Vue) {
		// 注册 components
		<% components.forEach((item) => { %>
	  Vue.component('<%= item.name %>', <%= item.name %>);
		<% }) %>

		<% modules.forEach((item) => { %>
	  Vue.component('<%= item.name %>', <%= item.name %>);
		<% }) %>
	}
}