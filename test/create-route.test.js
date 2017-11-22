import { createRoutes } from "../server/utils";

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
	let exclude = {
		chunkName: "pages/clinic/log/diagnosis",
		component: "/pages/clinic/log/diagnosis.vue",
		name: "clinic-log-diagnosis",
		path: "/clinic/log/diagnosis"
	};

	it("should routes be nested", () => {
		expect(results).not.toEqual(expect.arrayContaining([exclude]));
	});

	it("page/index 对应的path 应该为/", () => {
		
		for(let item of results) {
			if(item.name === 'index') {
				expect(item.path).toEqual('/')
				break;
			}
		}
	});

	it("除开第一级目录外，其他目录中的index对应的path应该为空字符串,name应该不包含index，且父data的name需要删除", () => {
		function check(items) {
			
			for(let item of items) {
				if(!!item.children) {
					for(let childItem of item.children) {
						if(childItem.chunkName.split('/').indexOf('index')>-1) {

							if(childItem.path !== '' || 'name' in item || ~childItem.name.indexOf('index')) {
								return false;
							}
						}	
					}
					if(!check(item.children)) {
							return false;
					}
				}
			}
			return true;
		}

		expect(check(results)).toBeTruthy()
	});

	it("noly 9 roues", () => {
		// 9 个 总路由
		expect(Object.keys(results).length).toEqual(9);
	});
});
