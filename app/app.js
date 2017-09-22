/*
* @Author: insane.luojie
* @Date:   2017-09-18 10:14:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-21 15:58:06
*/
import Vue from "vue";
import {createRouter} from "./router";
import Vuex from "vuex";

const router = createRouter();

export default new Vue({
    el: "#app",
    router,
    watch: {
        '$route': function (to, from) {
            console.log("navigate: ", to.name, from.name);
        }
    }
});