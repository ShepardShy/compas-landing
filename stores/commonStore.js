import { defineStore } from "pinia";
import api from "~/helpers/api.js";

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
			console.log(`about to restore 'commonStore'`);
			// ctx.store.lastModified = null,
		},
		storage: persistedState.localStorage,
	},

	// actions
	actions: {},
});
