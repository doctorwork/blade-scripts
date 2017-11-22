/*
 * @Author: insane.luojie
 * @Date:   2017-09-18 10:14:20
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-22 11:10:28
 */
/*eslint-disable*/

import Vue from 'vue'
import Router from 'vue-router'
<% if(opts.plugins.route) { %>import beforeEachRoute from '<%= opts.plugins.route %>';<% } %>
<% let _notFound = "";
  let tab = '\t\t';
  if ( opts.views.notFound !== false) { %>
import notFound from '<%= opts.views.notFound %>';
<%
    _notFound += '{\n'
    _notFound += tab + 'name: "notFound",\n'
    _notFound += tab + 'path: "*",\n'
    _notFound += tab + 'component: notFound,\n'
    _notFound += tab + '}'
  }
%>
Vue.use(Router)

const DefaultRouteComponent = {
    template: "<router-view></router-view>"
}
<%
function recursiveRoutes(routes, tab, components) {
  let res = ''
  routes.forEach((route, i) => {
    route.path = opts.routes[route.name] ? opts.routes[route.name] : route.path;

    if (route.component == 'default') {
        route._name = "DefaultRouteComponent";
    } else {
        route._name = '_' + hash(route.component)
        components.push({ _name: route._name, component: route.component, name: route.name, chunkName: route.chunkName })
    }

    res += tab + '{\n'
    res += tab + '\tpath: ' + JSON.stringify(route.path) + ',\n'
    res += tab + '\tcomponent: ' + route._name
    res += (route.name) ? ',\n\t' + tab + 'name: ' + JSON.stringify(route.name) : ''
    res += (route.children) ? ',\n\t' + tab + 'children: [\n' + recursiveRoutes(routes[i].children, tab + '\t\t', components) + '\n\t' + tab + ']' : ''
    res += '\n' + tab + '}' + (i + 1 === routes.length ? '' : ',\n')
  })
  return res
}
const _components = []
const _routes = recursiveRoutes(router.routes, '\t\t', _components)
uniqBy(_components, '_name').forEach((route) => { %>
const <%= route._name %> = () => import ('<%= relativeToBuild(route.component) %>' /* webpackChunkName: "<%= wChunk(route.chunkName) %>" */ ).then(m => m.default || m) <% }) %>

<% if (router.scrollBehavior) { %>
const scrollBehavior = <%= serialize(router.scrollBehavior).replace('scrollBehavior(', 'function(').replace('function function', 'function') %>
<% } else { %>
const scrollBehavior = (to, from, savedPosition) => {
    // SavedPosition is only available for popstate navigations.
    if (savedPosition) {
        return savedPosition
    } else {
        let position = {}
        // If no children detected
        if (to.matched.length < 2) {
            // Scroll to the top of the page
            position = { x: 0, y: 0 }
        } else if (to.matched.some((r) => r.components.default.scrollToTop)) {
            // If one of the children has scrollToTop option set to true
            position = { x: 0, y: 0 }
        }
        // If link has anchor, scroll to anchor by returning the selector
        if (to.hash) {
            position = { selector: to.hash }
        }
        return position
    }
}
<% } %>
// 路由插件处理

export function createRouter() {
    const router = new Router({
        mode: '<%= router.mode %>',
        base: '<%= router.base %>',
        linkActiveClass: '<%= router.linkActiveClass %>',
        linkExactActiveClass: '<%= router.linkExactActiveClass %>',
        scrollBehavior,
        routes: [
        <%= _routes %>,
        <%= _notFound %>
        ]
    })
    <% if(opts.plugins.route) { %>
    if (beforeEachRoute.length == 3) {
        router.beforeEach(beforeEachRoute);
    } else {
        beforeEachRoute(router);
    }
    <% } %>
    return router;
}