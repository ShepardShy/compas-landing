import { defineStore } from "pinia";

export const useDistanceStore = defineStore("distanceStore", {
	state: () => {
		return {
			textLength: "0",
			coords: "",
			historyId: 0,
			history: [],
			tab: "",
		};
	},

	persist: {
		storage: persistedState.localStorage,
	},

	actions: {},
});
