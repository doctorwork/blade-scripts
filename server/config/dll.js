/*
* @Author: insane.luojie
* @Date:   2017-09-21 11:34:36
* @Last Modified by:   insane.luojie
* @Last Modified time: 2017-09-21 11:37:42
*/


export default function dllConfig (base) {
	const conf = Object.assign({}, base, {
		name: "dllconf",
		entry: {
			vendor: ['vue', 'vue-route', 'vuex']
		}
	});

	return conf;
}