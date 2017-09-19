/*
* @Author: insane.luojie
* @Date:   2017-09-18 10:14:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-19 20:08:50
*/
import Vue from "vue";
import Router from "vue-router";
import Page from "./lib/page";

Vue.use(Router);

// 获取路由，以及路由文件执行覆盖
const routes = []; // require("blade/router");

// 公共页面路由

const router = new Router({
    mode: 'history',
    routes
});

export default new Vue({
    el: "#main",
    router,
    watch: {
        '$route': function (to, from) {
            console.log("navigate: ", to.name, from.name);
        }
    }
});