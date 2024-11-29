import { defineStore } from "pinia";
import { useGlobalStore } from "~/stores/globalStore";
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
		lastModifiedCache: null, // Дата последнего изменения с сервера
		cachedQuestions: null, // Закэшированные данные гайдов
		cachedCategories: null, // Закэшированные категории
		lastTimeCategory: null,
		lastTimePage: null,
		lastTimePerPage: null,
	}),
	getters: {
		currentTitle() {
			if (!this.categories) return null;
			const activeChild = this.activeChild;
			if (activeChild) {
				return activeChild.mainTitle;
			}
			const category = this.categories.find((category) => (route.fullPath.includes(category.value) ? category : null));
			return category ? category.mainTitle : "Вопрос-ответ";
		},

		activeChild: (state) => {
			if (!state.categories) return null;
			for (const category of state.categories) {
				const child = category.children?.find((child) => route.fullPath.includes(child.value));
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
			return this.categories?.map((category) => ({
				...category,
				value: category.slug,
				title: category.name,
				isOpen: false,
				children: category.children?.map((child) => ({
					value: child.slug,
					title: child.name,
				})),
			}));
		},

		currentCategory() {
			return (slug) => this.categories?.find((category) => category.value === slug);
		},

		currentCategoryId() {
			return this.categories?.find((category) => category.slug == route.params.category)?.id;
		},

		countPages() {
			return this.questions?.list.last_page;
		},
	},
	actions: {
		async loadQuestions(categoryParam) {
			if (this.canUpdate) {
				console.log(123);
				console.log(this.page, "this.page");
				this.questions = [];
				const globalStore = useGlobalStore();
				const lastModified = globalStore.lastModified;
				if (
					this.lastModifiedCache === lastModified.faq &&
					this.cachedQuestions &&
					this.cachedCategories &&
					categoryParam == this.lastTimeCategory &&
					this.lastTimePage == this.page &&
					this.lastTimePerPage == this.perPage
				) {
					// Используем кэшированные данные
					this.questions = this.cachedQuestions;
					this.categories = this.cachedCategories;
				} else {
					// Загружаем новые данные
					const { categories } = await api.callMethod("GET", `faq`, {});
					console.log(this.page, "this.page");
					this.categories = categories;
					const categoryId = this.categories?.find((category) => category.slug == categoryParam)?.id;
					console.log(this.lastTimePage, "this.lastTimePage");
					console.log(this.page, "this.page");
					const resQuestions = await api.callMethod("GET", `faq?page=${this.page}&per_page=${this.perPage}&q=${categoryId ? `&filter[category_id]=${categoryId}` : ""}`, {});
					this.questions = resQuestions;

					// Обновляем кэш
					this.lastTimeCategory = categoryParam;
					this.cachedQuestions = resQuestions;
					this.cachedCategories = this.categories;
					this.lastModifiedCache = lastModified.faq;
					this.lastTimePage = this.page;
					this.lastTimePerPage = this.perPage;
				}

				if (this.page > this.countPages) {
					this.page = 1;
				}
			}
		},
		async loadQuestion(slug) {
			this.questionDetail = await api.callMethod("GET", `faq/${slug}`, {});
		},
		async searchOptions(search) {
			const res = await api.callMethod("GET", `faq/search?q=${search}&entity=faq`, {});
			if (res?.length > 0) {
				return res;
			}
			return [{ label: { text: "Не найдено" } }];
		},
		async showMore() {
			this.canUpdate = false;
			if (this.page + 1 > this.countPages) {
				this.canUpdate = true;
				return;
			}
			this.page++;
			const categoryId = this.categories?.find((category) => category.slug == route.params.category)?.id;
			const newQuestions = await api.callMethod("GET", `faq?page=${this.page}&per_page=${this.perPage}&q=${categoryId ? `&filter[category_id]=${categoryId}` : ""}`);
			if (newQuestions?.list?.data?.length > 0) {
				this.questions.list.data = [...this.questions.list.data, ...newQuestions.list.data];
			}
			this.canUpdate = true;
		},
	},
	persist: {
		afterRestore: (ctx) => {
			console.log(`about to restore 'commonStore'`);
			// ctx.store.lastModified = null,
		},
		storage: persistedState.localStorage,
		paths: ["lastModifiedCache", "cachedCategories", "cachedQuestions", "lastTimeCategory", "lastTimePage", "lastTimePerPage"],
	},
});
