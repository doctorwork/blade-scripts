/*
* @Author: insane.luojie
* @Date:   2017-09-18 13:20:27
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-18 17:33:49
*/

module.exports = function printAndExit (message, code = 1) {
  if (code === 0) {
    console.log(message)
  } else {
    console.error(message)
  }

  process.exit(code)
}