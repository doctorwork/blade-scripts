
const routes = [
  "pages/about.vue",
  "pages/article.vue",
  "pages/clinic.vue",
  "pages/clinic/about.vue",
  "pages/clinic/appoint.vue",
  "pages/clinic/index.vue",
  "pages/clinic/log.vue",
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
  return file.replace(/^pages\//, '').replace(/\.vue$/, '')
}


function createRoutes(files, srcDir) {

  let router = {};

  files.forEach((file) => {
    // 只解析两层目录 
    let filePath = split_path(file).split('/');
    let obj = router[filePath[0]] || (router[filePath[0]] = {});
    let name = filePath[0];

    if (filePath.length > 1) {

      for (let i = 1; i < filePath.length; i++) {
        let key = filePath[i];
        obj = obj[key] || (obj[key] = Object.create(null));
        name += '-' + key;
      }
    }

    obj.name = name;
    obj.path = '/' + filePath[filePath.length - 1];
    obj.chunkName = file.replace(/\.vue$/, '');
  });

  let ary = changeDicToAry(router);
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
        for(let childItem of children) {
          if(childItem.path === '/index') {
            delete item.name;
            childItem.path = '';
            childItem.name = 'index';
          }
        }
        item.children = children;
      }

      delete router[key];
    }
  }
  return result;
}

function cleanChildrenRoutes(routes, isChild = false) {
  let start = -1
  let routesIndex = []
  routes.forEach((route) => {
    if (/-index$/.test(route.name) || route.name === 'index') {
      // Save indexOf 'index' key in name
      let res = route.name.split('-')
      let s = res.indexOf('index')
      start = (start === -1 || s < start) ? s : start
      routesIndex.push(res)
    }
  })
  routes.forEach((route) => {
    route.path = (isChild) ? route.path.replace('/', '') : route.path
    if (route.path.indexOf('?') > -1) {
      let names = route.name.split('-')
      let paths = route.path.split('/')
      if (!isChild) {
        paths.shift()
      } // clean first / for parents
      routesIndex.forEach((r) => {
        let i = r.indexOf('index') - start //  children names
        if (i < paths.length) {
          for (let a = 0; a <= i; a++) {
            if (a === i) {
              paths[a] = paths[a].replace('?', '')
            }
            if (a < i && names[a] !== r[a]) {
              break
            }
          }
        }
      })
      route.path = (isChild ? '' : '/') + paths.join('/')
    }
    route.name = route.name.replace(/-index$/, '')
    if (route.children) {
      if (route.children.find((child) => child.path === '')) {
        delete route.name
      }
      route.children = cleanChildrenRoutes(route.children, true)
    }
  })
  return routes
}
