import { defineStore } from "pinia";

export const useFinesStore = defineStore("finesStore", {
	state: () => {
		return {
			fields: [],
			fines: [],
		};
	},

	persist: {
		storage: persistedState.localStorage,
	},

	actions: {},
});
