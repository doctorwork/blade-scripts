/*
 * @Author: insane.luojie
 * @Date:   2017-09-22 16:26:53
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-23 15:35:14
 */
/* eslint-disable */

<% if (plugins.global) { %>
import plugin from '<%= relativeToBuild(plugins.global) %>';
<% } %>
<% if (opts.addons.sentry){ %>
import Raven from "raven-js";
import RavenVue from "raven-js/plugins/vue";
<% } %>

export default {
    install(Vue) {
        <% if (plugins.global) { %>
        plugin(Vue);
        <% } %>

        // 设置 打点 raven-js
        <% if(opts.addons.sentry) {%>
            if(process.env.NODE_ENV !== 'development' ){
                Raven
                .config('<%= opts.addons.sentry.dns %>',{
                    release : '<%= opts.version %>'
                })
                .addPlugin(RavenVue, Vue)
                .setTagsContext({
                    environment : process.env.NODE_ENV
                })
                .install();
            }
        <% } %>
    }
}