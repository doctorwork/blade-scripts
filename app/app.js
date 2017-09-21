/*
* @Author: insane.luojie
* @Date:   2017-09-18 10:14:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-20 11:37:04
*/
import Vue from "vue";
import router from "./router";
// import Vuex from "vuex";

export default new Vue({
    el: "#app",
    router,
    watch: {
        '$route': function (to, from) {
            console.log("navigate: ", to.name, from.name);
        }
    }
});