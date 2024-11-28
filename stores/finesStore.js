import { defineStore } from "pinia";

export const useFinesStore = defineStore("finesStore", {
	state: () => {
		return {
			fields: null,
			fines: [],
			tableSettings: null,
		};
	},

	persist: {
		storage: persistedState.localStorage,
	},

	actions: {},
});
