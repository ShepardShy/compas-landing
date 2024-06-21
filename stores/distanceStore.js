import { defineStore } from "pinia";

export const useDistanceStore = defineStore("distanceStore", {
	state: () => {
		return {
			textLength: "0",
			coords: "",
			historyId: 0,
			history: [],
		};
	},

	persist: {
		afterRestore: ctx => {
			console.log(`about to restore '${ctx.store.$id}'`);
		},
		storage: persistedState.localStorage,
	},

	actions: {},
});
