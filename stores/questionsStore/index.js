import { defineStore } from "pinia";
import categories from "./data/categories.json";
import api from "~/helpers/api.js";

const route = useRoute();

export const useQuestionsStore = defineStore("questionsStore", {
	state: () => ({
		questions: null,
		questionDetail: null,
		categories: null,
		page: 1,
		perPage: 12,
		canUpdate: true,
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

		currentCategoryId() {
			return this.categories?.find(category => category.slug == route.params.id)?.id;
		},

		countPages() {
			return this.questions?.list.last_page;
		},
	},
	actions: {
		async loadQuestions() {
			if (this.canUpdate) {
				const { categories } = await api.callMethod("GET", `faq`, {});
				this.categories = categories;
				const categoryId = this.categories?.find(category => category.slug == route.params.id)?.id;
				this.questions = await api.callMethod("GET", `faq?page=${this.page}&per_page=${this.perPage}&q=${categoryId ? `&filter[category_id]=${categoryId}` : ""}`, {});

				if (this.page > this.countPages) {
					this.page = 1;
				}
			}
		},
		async loadQuestion(slug) {
			if (slug) {
				this.questionDetail = await api.callMethod("GET", `faq/${slug}`, {});
			}
		},
		async searchOptions(search) {
			return await api.callMethod("GET", `faq/search?q=${search}&entity=faq`, {});
		},
		async showMore() {
			this.canUpdate = false;
			if (this.page + 1 > this.countPages) {
				this.canUpdate = true;
				return;
			}
			this.page++;
			const categoryId = this.categories?.find(category => category.slug == route.params.id)?.id;
			const newQuestions = await api.callMethod("GET", `faq?page=${this.page}&per_page=${this.perPage}&q=${categoryId ? `&filter[category_id]=${categoryId}` : ""}`);
			if (newQuestions?.list?.data?.length > 0) {
				this.questions.list.data = [...this.questions.list.data, ...newQuestions.list.data];
			}
			this.canUpdate = true;
		},
	},
});
