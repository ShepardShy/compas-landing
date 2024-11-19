import { defineStore } from "pinia";

export const useCommonStore = defineStore("commonStore", {
	// states
	state: () => {
		return {
			isShowMobileMenu: true,
			menu: [],
			activeTab: null,
			tabs: [],
			updatedMethods: {},
			modalInfo: [],
			accounts: [],
		};
	},

	persist: {
		afterRestore: (ctx) => {
			console.log(`about to restore '${ctx.store.$id}'`);
		},
		storage: persistedState.localStorage,
	},

	// actions
	actions: {
		// async loadQuestions(route,slug, ids) {
		// 	const query =
		// 	return await api.callMethod("GET", `${route}/${slug}`, {});
		// 	// this.articleDetail = await api.callMethod("GET", `blog/${slug}`, {});
		// },
	},
});
