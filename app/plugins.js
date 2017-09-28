/*
* @Author: insane.luojie
* @Date:   2017-09-22 16:26:53
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-28 17:27:58
*/

const plugins = {};

<% if (plugins.route) { %>
plugins.route = import '<%= relativeToBuild(plugins.route) %>';
<% } %>

<% if (plugins.store) { %>
plugins.store = import '<%= relativeToBuild(plugins.store) %>';
<% } %>

export default plugins
