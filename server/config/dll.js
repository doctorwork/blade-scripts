/*
* @Author: insane.luojie
* @Date:   2017-09-21 11:34:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-28 11:01:14
*/


export default function dllConfig (base) {
	const conf = Object.assign({}, base, {
		name: "dll",
		entry: {
			vendor: ['vue', 'vue-route', 'vuex']
		}
	});

	return conf;
}