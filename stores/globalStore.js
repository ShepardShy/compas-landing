import { defineStore } from "pinia";
import api from "~/helpers/api.js";

export const useGlobalStore = defineStore("globalStore", {
	// states
	state: () => {
		return {
			lastModified: null,
		};
	},

	// actions
	actions: {
		async loadLastModified() {
			console.log("loadLastModified");
			const lastModified = await api.callMethod("GET", `entities/last_modified`, {});
			this.lastModified = lastModified;
			return lastModified;
		},
	},
});
