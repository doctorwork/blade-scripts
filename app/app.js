/*
* @Author: insane.luojie
* @Date:   2017-09-18 10:14:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-29 10:26:40
*/
import Vue from "vue";
import {createRouter} from "./router";
import store from "./store";
import InstallComponents from "./components";
<% opts.css.forEach(item => { %>import "<%= item %>";<% }) %>

// 插件注入
Vue.use(InstallComponents);

const router = createRouter();
const app = new Vue({
    el: "#app",
    router,
    store,
    watch: {
        '$route': function (to, from) {
          console.log("navigate: ", to.name, from.name);
        }
    }
});

export default {
	app
}