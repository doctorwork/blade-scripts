/*
* @Author: insane.luojie
* @Date:   2017-09-22 16:26:53
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-28 17:27:58
*/
/*eslint-disable*/

<% if (plugins.global) { %>
import plugin from '<%= relativeToBuild(plugins.global) %>';
<% } %>

export default {
    install (Vue) {
        <% if (plugins.global) { %>
        plugin(Vue);
        <% } %>
    }
}
