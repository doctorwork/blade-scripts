/*
* @Author: insane.luojie
* @Date:   2017-09-18 10:14:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 14:45:49
*/

/*eslint-disable*/

import Vue from "vue";
import {createRouter} from "./router";
import "./assets/reset"; // 全局样式
import installPlugins from "./plugins";
import App from "./layouts/app";
<% if (opts.vuex) { %>
import store from "<%= opts.vuex %>";
<% } %>
import InstallComponents from "./components";
<% opts.css.forEach(item => { %>import "<%= item %>";<% }) %>

// 插件注入
Vue.use(InstallComponents);
Vue.use(installPlugins);

const router = createRouter();
const app = new Vue({
    el: "#app",
    ...App,
    router,
    <% if (opts.vuex) { %>
    store,
    <% } %>
    watch: {
        '$route': function (to, from) {
        }
    }
});

export default {
	app
}