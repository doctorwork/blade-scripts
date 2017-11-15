/*
* @Author: insane.luojie
* @Date:   2017-09-26 11:55:34
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-15 11:46:50
*/
/*eslint-disable*/

<% components.forEach((item) => { %>import <%= item.varName %> from '<%= relativeToBuild(item.path) %>';
<% }) %>
<% modules.forEach((item) => { %>import <%= item.varName %> from '<%= relativeToBuild(item.path) %>';
<% }) %>

export default {
	install (Vue) {
		// 注册 components
        <% components.forEach((item) => { %>Vue.component('<%= item.name %>', <%= item.varName %>);
        <% }) %>
        <% modules.forEach((item) => { %>Vue.component('<%= item.name %>', <%= item.varName %>);
        <% }) %>
	}
}