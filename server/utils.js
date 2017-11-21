/*
 * @Author: insane.luojie
 * @Date:   2017-09-20 16:00:05
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-20 22:15:59
 */

import { resolve, sep, relative } from "path";
import _ from "lodash";

const reqSep = /\//g;
const sysSep = _.escapeRegExp(sep);
const normalize = string => string.replace(reqSep, sysSep);
export const isWindows = /^win/.test(process.platform);
export const isMac = /^darwin/.test(process.platform);

export function isUrl(url) {
    return url.indexOf("http") === 0 || url.indexOf("//") === 0;
}

export function isPureObject(o) {
    return !Array.isArray(o) && typeof o === "object";
}

/**
 * 路径替换
 * @param  {String} p 
 */
export function wp(p = "") {
    /* istanbul ignore if */
    if (isWindows) {
        return p.replace(/\\/g, "\\\\");
    }
    return p;
}

/**
 * 解析地址
 * @return {[type]} [description]
 */
export function r() {
    let args = Array.prototype.slice.apply(arguments);
    let lastArg = _.last(args);

    if (lastArg.includes("@") || lastArg.includes("~")) {
        return wp(lastArg);
    }

    return wp(resolve(...args.map(normalize)));
}

export function relativeTo() {
    let args = Array.prototype.slice.apply(arguments);
    let dir = args.shift();

    // Resolve path
    let path = r(...args);

    // Check if path is an alias
    if (path.includes("@") || path.includes("~")) {
        return path;
    }

    // Make correct relative path
    let rp = relative(dir, path);
    if (rp[0] !== ".") {
        rp = "./" + rp;
    }
    return wp(rp);
}

function split_path(file) {
    return file
        .replace(/^pages\//, "")
        .replace(/\.vue$/, "")
        .split("/");
}



export function createRoutes(files, srcDir) {

    let router = {};

    files.forEach((file) => {
        // 只解析两层目录 
        let filePath = split_path(file);
        let obj = router[filePath[0]] || (router[filePath[0]] = {});
        let name = filePath[0];

        if (filePath.length > 1) {

            for (let i = 1; i < filePath.length; i++) {
                let key = filePath[i];
                obj = obj[key] || (obj[key] = Object.create(null));
                if (key !== 'index') {
                    name += '-' + key;
                }
            }
        }

        obj.name = name;
        obj.component = r(srcDir, file);
        obj.path = '/' + filePath[filePath.length - 1];
        obj.chunkName = file.replace(/\.vue$/, '');
    });

    let ary = changeDicToAry(router);

    for (let item of ary) {
        if (item.name === 'index') {
            item.path = '/';
            break;
        }
    }
    return ary;
}

function changeDicToAry(router) {
    let result = [];
    for (let key of Object.keys(router)) {
        let item = router[key];
        if (typeof item === 'object' && key !== 'children') {
            result.push(item);

            if (item.path === '/index') {
                item.path = '';
            }

            let children = changeDicToAry(item);

            if (children.length > 0) {

                delete item.name;
                item.children = children;
            }

            delete router[key];
        }
    }
    return result;
}

export function cleanChildrenRoutes(routes, isChild = false) {
    let start = -1;
    let routesIndex = [];
    routes.forEach(route => {
        if (/-index$/.test(route.name) || route.name === "index") {
            // Save indexOf 'index' key in name
            let res = route.name.split("-");
            let s = res.indexOf("index");
            start = start === -1 || s < start ? s : start;
            routesIndex.push(res);
        }
    });
    routes.forEach(route => {
        route.path = isChild ? route.path.replace("/", "") : route.path;
        if (route.path.indexOf("?") > -1) {
            let names = route.name.split("-");
            let paths = route.path.split("/");
            if (!isChild) {
                paths.shift();
            } // clean first / for parents
            routesIndex.forEach(r => {
                let i = r.indexOf("index") - start; //  children names
                if (i < paths.length) {
                    for (let a = 0; a <= i; a++) {
                        if (a === i) {
                            paths[a] = paths[a].replace("?", "");
                        }
                        if (a < i && names[a] !== r[a]) {
                            break;
                        }
                    }
                }
            });
            route.path = (isChild ? "" : "/") + paths.join("/");
        }
        route.name = route.name.replace(/-index$/, "");
        if (route.children) {
            if (route.children.find(child => child.path === "")) {
                delete route.name;
            }
            route.children = cleanChildrenRoutes(route.children, true);
        }
    });
    return routes;
}

export function sequence(tasks, fn) {
    return tasks.reduce(
        (promise, task) => promise.then(() => fn(task)),
        Promise.resolve()
    );
}

export function wChunk(p = "") {
    /* istanbul ignore if */
    if (isWindows) {
        return p.replace(/\//g, "\\\\");
    }
    return p;
}

export function urlJoin() {
    return [].slice
        .call(arguments)
        .join("/")
        .replace(/\/+/g, "/")
        .replace(":/", "://");
}

export function isObject(obj) {
    return typeof obj == "object";
}
