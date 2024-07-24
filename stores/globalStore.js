import { defineStore } from "pinia";

export const useGlobalStore = defineStore("globalStore", {
	// states
	state: () => {
		return {
			isShowMobileMenu: true,
			isShowOnlyLogo: false,
		};
	},
});
