import { defineStore } from "pinia";

export const useDistanceStore = defineStore("distanceStore", {
	state: () => {
		return {
			text: "",
			coords: "",
		};
	},

	persist: {
		storage: persistedState.localStorage,
	},

	actions: {},
});
