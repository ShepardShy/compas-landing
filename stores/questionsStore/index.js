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
			const category = this.categories.find(category => (route.fullPath.includes(category.value) ? category : null));
			return category ? category.mainTitle : this.categories[0].mainTitle;
		},

		activeChild: state => {
			for (const category of state.categories) {
				const child = category.children?.find(child => route.fullPath.includes(child.value));
				if (child) {
					return child;
				}
			}
			return null;
		},
	},
	actions: {},
});
