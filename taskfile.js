/*
 * @Author: insane.luojie
 * @Date:   2017-09-19 11:12:23
 * @Last Modified by:   insane.luojie
 * @Last Modified time: 2017-09-29 14:38:16
 */

export default async function (task) {
  await task.start('copy')
  await task.start('build')
  await task.watch('tasks/*', 'bin')
  await task.watch('server/**/*.js', 'server')
  await task.watch('app/**', 'copy')
}

export async function bin(task, opts) {
  await task.source(opts.src || 'tasks/*').babel().target('dist/tasks', {
    mode: '0755'
  })
  // notify('Compiled binaries')
}

export async function copy(task) {
  await task.source(['index.js', 'utils.js']).target('dist', {
    mode: '0755'
  });
  await task.source(['app/**']).target('dist/app');
}

export async function release(task) {
  await task.clear('dist').start('build');
}

export async function build(task) {
  await task.clear('dist').serial(['copy', 'compile'])
}

export async function compile(task) {
  await task.parallel(['bin', 'server'])
}

export async function server(task) {
  await task.source('server/**').babel().target('dist/server', {
    mode: '0755'
  })
}