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
	actions: {},
});
