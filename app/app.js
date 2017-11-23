/*
 * @Author: insane.luojie
 * @Date:   2017-09-18 10:14:36
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-15 11:47:50
 */

/*eslint-disable*/

import Vue from "vue";
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import { createRouter } from "./router";
import "./assets/reset"; // 全局样式
import installPlugins from "./plugins";
import App from "<%= opts.layout.main %>";
<% if (opts.vuex) { %>import store from "./store";<% } %>
import InstallComponents from "./components";
<% opts.css.forEach(item => { %>import "<%= item %>";<% }) %>
<% if (opts.type == 'mobile') { %>// 设置 rem
document.documentElement.style.fontSize = '20px';<% } %>

<% if(opts.addons.sentry && opts.addons.sentry.host) {%>
    if(process.env.NODE_ENV === 'production' ){
        Raven
        .config('<%= opts.addons.sentry.dns %>',{
            release : '<%= opts.version %>'
        })
        .addPlugin(RavenVue, Vue)
        .setTagsContext({
            environment : 'production'
        })
        .install();
    }
<% } %>

// 插件注入
Vue.use(InstallComponents);
Vue.use(installPlugins);

Vue.config.devtools = process.env.NODE_ENV !== 'production';

const router = createRouter();
const app = new Vue({
    el: "#app",
    ...App,
    router<% if (opts.vuex) { %>,
    store <% } %>
});

export default {
    app
}