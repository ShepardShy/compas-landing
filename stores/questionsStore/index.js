import { defineStore } from "pinia";
import categories from "./data/categories.json";
import api from "~/helpers/api.js";

const route = useRoute();

export const useQuestionsStore = defineStore("questionsStore", {
	state: () => ({
		questions: null,
		questionDetail: null,
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

		questionsList() {
			return this.questions?.list?.data || [];
		},
	},
	actions: {
		async loadQuestions() {
			console.log(123);

			this.questions = await api.callMethod("GET", "faq", {});
		},
		async loadQuestion(slug) {
			if (slug) {
				this.questionDetail = await api.callMethod("GET", `faq/${slug}`, {});
			}
		},
	},
});
