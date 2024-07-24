import { defineStore } from "pinia";
import categories from "./data/categories.json";

const route = useRoute();

export const useQuestionsStore = defineStore("questionsStore", {
	state: () => ({
		categories: categories,
	}),
	getters: {
		currentTitle() {
			const activeChild = this.activeChild;
			if (activeChild) {
				return activeChild.mainTitle;
			}
			const category = this.categories.find(category => category.value == (route.params.category ? route.params.category : "all"));
			return category ? category.mainTitle : null;
		},

		activeChild: state => {
			for (const category of state.categories) {
				const child = category.children?.find(child => child.value == route.params.category);
				if (child) {
					return child;
				}
			}
			return null;
		},

		activeParent: state => {
			return state.categories.find(category => category.children?.some(child => child.value == route.params.category));
		},
	},
	actions: {},
});
