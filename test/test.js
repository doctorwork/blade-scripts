let _ = require('lodash');
let path = require('path');
let resolve = path.resolve;


/**
 * 路径替换
 * @param  {String} p 
 */
function wp(p = "") {
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
function r() {
    let args = Array.prototype.slice.apply(arguments);
    let lastArg = _.last(args);

    if (lastArg.includes("@") || lastArg.includes("~")) {
        return wp(lastArg);
    }

    return wp(resolve(...args.map(normalize)));
}

const routes = [
  "pages/about.vue",
  "pages/article.vue",
  "pages/clinic.vue",
  "pages/clinic/about.vue",
  "pages/clinic/appoint.vue",
  "pages/clinic/index.vue",
  // "pages/clinic/log.vue",
  "pages/clinic/log/bills.vue",
  "pages/clinic/log/checkup.vue",
  "pages/clinic/log/diagnosis.vue",
  "pages/clinic/log/index.vue",
  "pages/feedback.vue",
  "pages/index.vue",
  "pages/messages.vue",
  "pages/notice.vue",
  "pages/sport.vue",
  "pages/sport/detail.vue",
  "pages/sport/history.vue",
  "pages/uc.vue"
];

createRoutes(routes);

function split_path(file) {
  return file.replace(/^pages\//, '').replace(/\.vue$/, '').split('/')
}

function createRoutes(files, srcDir) {

  let router = {};

  files.forEach((file) => {
    // 只解析两层目录 
    let filePath = split_path(file);
    let obj = router;
    let name = filePath[0];
    
    for (let i = 0; i < filePath.length; i++) {
      let key = filePath[i];
      obj = obj[key] || (obj[key] = Object.create(null));

      if (!("name" in obj)) {
        obj.name = name;
        obj.path = '/' + filePath[i];
        obj.component = 'default';
      }

      if (key !== 'index' && i != 0) {
        name += '-' + key;
      }
    }
    // obj.component = r(srcDir, file);
    obj.chunkName = file.replace(/\.vue$/, '');
  });

  let ary = changeDicToAry(router);
  for (let item of ary) {
    if (item.name === 'index') {
      item.path = '/';
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

      let children = changeDicToAry(item);

      if (children.length > 0) {

        for (let childrenItem of children) {

          if (childrenItem.path === '/index') {
            childrenItem.path = '';
            delete item.name;
            break;
          }
        }
        item.children = children;

      }

      delete router[key];
    }
  }
  return result;
}
