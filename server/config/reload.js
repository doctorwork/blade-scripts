/*
* @Author: insane.luojie
* @Date:   2017-09-21 17:21:02
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-21 17:21:05
*/
/* eslint-disable */
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})