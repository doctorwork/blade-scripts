/*
* @Author: insane.luojie
* @Date:   2017-09-18 10:14:20
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-19 10:25:20
*/

let routes = Object.keys(__routes__).map(function (route) {
    let path = __routes__[route];
    if (route == 'index') {
        let index = resolve => import(
            './pages/index/index'
        ).then(resolve)
        return {
            path: '/',
            name: "default",
            component: index
        }
    }
    return {
        path: `/${route}/:module?/:action?`,
        name: `${route}`,
        component: Object.assign({}, Page, { name: route })
    }
});

module.exports = [{
	path: "/",
	name: "default",
	component: require('pages/index/index')
}]