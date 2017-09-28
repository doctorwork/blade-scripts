/*
* @Author: insane.luojie
* @Date:   2017-09-18 10:14:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-28 10:24:37
*/
import Vue from "vue";
import {createRouter} from "./router";
import store from "./store";
import "static/style.less";

// 插件注入

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