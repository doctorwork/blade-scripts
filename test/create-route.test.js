// import { createRoutes } from "../server/utils";
let { createRoutes } = require('../server/utils');
describe("create routes", () => {
	// Now mount the component, and you have the wrapper.
	const routes = [
		"pages/about.vue",
		"pages/article.vue",
		"pages/clinic.vue",
		"pages/clinic/about.vue",
		"pages/clinic/appoint.vue",
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

	let dir = "/";
	let results = createRoutes(routes, dir);

	function filterRouter(router, exeFunc, isRoot) {
		for (let item of router) {


			isRoot && exeFunc(item)


			if (!!item.children) {
				for (let childItem of item.children) {
					exeFunc(item, childItem, false);
				}

				filterRouter(item.children, exeFunc);
			}
		}
		return function(){}
	}

	it(`检测path：第一级的path应该为/{name}的形式，第一级的index对应的path应该是/, 
			其他子目录的path应该为{name},不包含/,如果name为index，那么对应的path应该为空字符串`, () => {
			function check(item, childItem) {
				if (arguments.length === 0) {
					return true;
				}

				if (arguments.length < 2) {
				
					if (item.path.indexOf('/') === -1) {
						throw new Error('第一级的path应该为/{name}的形式,而给的path=' + item.path);
					}
					
					if (item.name === 'index' && item.path !== '/') {
						throw new Error('第一级的index对应的path应该是空字符串, 而给的path=' + item.path);
					}
				}
				else {
					//其他子目录的path应该为{name},不包含/
					if (childItem.path.indexOf('/') > -1) {
							throw new Error('其他子目录的path应该为{name},不包含/,而给的path=' + item.path);
					}
					//如果name为index，那么对应的path应该为空字符串
					if (childItem.chunkName.split('/').pop() === 'index' && childItem.path !== '') {
						throw new Error('如果name为index，那么对应的path应该为空字符串,而给的path=' + item.path);
					}
				}
			}

			expect(filterRouter(results, check, true)).not.toThrow(Error)
		});

	it("检测name：如果子目录包含index，那么需要删除name属性", () => {
		function check(item, childItem) {
			if (arguments.length >= 2) {
				if (childItem.chunkName.split('/').pop() === 'index'
					&& 'name' in item
				) {

					throw new Error('如果子目录包含index，那么需要删除name属性');
				}
			}
			return function(){};
		}

		expect(filterRouter(results, check, true)).not.toThrow(Error)
	});

});
