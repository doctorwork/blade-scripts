/*
 * @Author: insane.luojie
 * @Date:   2017-09-21 17:21:02
 * @Last Modified by:   insane.luojie
 * @Last Modified time: 2017-09-28 11:56:14
 */
/* eslint-disable */
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?reload=true&path=/__webpack_hmr');

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})