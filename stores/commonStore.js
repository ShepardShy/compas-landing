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

	persist: true,

	// actions
	actions: {},
});
