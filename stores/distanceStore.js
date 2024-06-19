import { defineStore } from "pinia";

export const useDistanceStore = defineStore("distanceStore", {
	state: () => {
		return {
			textLength: "0",
			coords: "",
			history: [],
		};
	},

	persist: {
		storage: persistedState.localStorage,
	},

	actions: {},
});
