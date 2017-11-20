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

	it("noly 9 roues", () => {
		// 9 个 总路由
		expect(Object.keys(results).length).toEqual(9);
	});
});
