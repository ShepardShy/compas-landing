import { defineStore } from "pinia";
import categories from "./data/categories.json";
import api from "~/helpers/api.js";

const route = useRoute();

export const useQuestionsStore = defineStore("questionsStore", {
	state: () => ({
		questions: null,
		questionDetail: null,
		categories: null,
	}),
	getters: {
		currentTitle() {
			if (!this.categories) return null;
			const activeChild = this.activeChild;
			if (activeChild) {
				return activeChild.mainTitle;
			}
			const category = this.categories.find(category => (route.fullPath.includes(category.value) ? category : null));
			return category ? category.mainTitle : this.categories[0].mainTitle;
		},

		activeChild: state => {
			if (!state.categories) return null;
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

		questionsCategories() {
			console.log(this.categories);

			return this.categories?.map(category => ({
				value: category.slug,
				title: category.name,
				isOpen: false,
				children: category.children?.map(child => ({
					value: child.slug,
					title: child.name,
				})),
			}));
		},
	},
	actions: {
		async loadQuestions() {
			this.questions = await api.callMethod("GET", "faq", {});
			this.categories = this.questions.categories;
		},
		async loadQuestion(slug) {
			if (slug) {
				this.questionDetail = await api.callMethod("GET", `faq/${slug}`, {});
			}
		},
	},
});
