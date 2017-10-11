/*
* @Author: insane.luojie
* @Date:   2017-09-20 11:37:44
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-25 15:11:55
*/
/*eslint-disable*/

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
let store = {};

<% if (opts.vuex) { %>
import _store from "<%= opts.vuex %>";
store = new Vuex.Store(_store)
<% } %>

export default store;