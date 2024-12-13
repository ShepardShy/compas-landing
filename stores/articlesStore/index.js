import { defineStore } from "pinia";
import api from "~/helpers/api.js";
import { useGlobalStore } from "~/stores/globalStore";

const route = useRoute();

export const useArticlesStore = defineStore("articlesStore", {
	state: () => ({
		articles: null,
		articleDetail: null,
		categories: null,
		page: 1,
		perPage: 12,
		canUpdate: true,
		isLoading: false,
		lastModifiedCache: null, // Дата последнего изменения с сервера
		cachedArticles: null, // Закэшированные данные гайдов
		cachedCategories: null, // Закэшированные категории
		lastTimeCategory: null,
		lastTimePage: null,
		lastTimePerPage: null,
	}),
	getters: {
		currentTitle() {
			if (!this?.categories) return null;
			const activeChild = this.activeChild;
			if (activeChild) {
				return activeChild.mainTitle;
			}
			const category = this.categories.find((category) => (route.fullPath.includes(category.slug) ? category : null));

			return category ? category.name : "Статьи";
		},
		activeChild: (state) => {
			if (!state?.categories) return null;
			for (const category of state.categories) {
				const child = category.children?.find((child) => route.fullPath.includes(child.value));
				if (child) {
					return child;
				}
			}
			return null;
		},
		articlesList() {
			// if (route.params?.id) {
			// 	return this.articles?.list?.data.filter((i) => i.slug != route.params.id && i?.slug?.value != route.params.id) || [];
			// }
			return this.articles?.list?.data || [];
		},
		articlesCategories() {
			return this.categories?.map((category) => ({
				...category,
				id: category.id,
				value: category.slug,
				title: category.name,
				isOpen: false,
				children: category.children?.map((child) => ({
					id: child.id,
					value: child.slug,
					title: child.name,
				})),
			}));
		},
		currentCategory() {
			return this.categories?.find((category) => category.value === route.params.category);
		},
		currentCategoryId() {
			return this.categories?.find((category) => category.slug == route.params.category)?.id;
		},
		countPages() {
			return this.articles?.list?.last_page;
		},
	},
	actions: {
		async loadArticles(categoryParam, categoryIdParam) {
			if (this.canUpdate) {
				this.articles = [];
				const globalStore = useGlobalStore();
				const lastModified = globalStore.lastModified;
				if (
					this.lastModifiedCache === lastModified.articles &&
					this.cachedArticles &&
					this.cachedCategories &&
					categoryParam == this.lastTimeCategory &&
					this.lastTimePage == this.page &&
					this.lastTimePerPage == this.perPage &&
					!categoryIdParam
				) {
					// Используем кэшированные данные
					this.articles = this.cachedArticles;
					this.categories = this.cachedCategories;
				} else {
					// Загружаем новые данные
					let categoryId;
					if (!categoryIdParam) {
						const { categories } = await api.callMethod("GET", `blog`, {});
						this.categories = categories;
						categoryId = this.categories?.find((category) => category.slug == categoryParam)?.id;
					} else {
						categoryId = categoryIdParam;
					}
					const resArticles = await api.callMethod("GET", `blog?page=${this.page}&per_page=${this.perPage}&q=${categoryId ? `&filter[category_id]=${categoryId}` : ""}`, {});
					this.articles = resArticles;

					// Обновляем кэш
					this.lastTimeCategory = categoryParam;
					this.cachedArticles = resArticles;
					console.log(resArticles, "resArticles");
					console.log(this.cachedArticles, "this.cachedArticles");
					this.cachedCategories = this.categories;
					this.lastModifiedCache = lastModified.articles;
					this.lastTimePage = this.page;
					this.lastTimePerPage = this.perPage;
				}

				if (this.page > this.countPages) {
					this.page = 1;
				}
			}
		},
		async loadArticle(slug) {
			this.articleDetail = await api.callMethod("GET", `blog/${slug}`, {});
			// this.articleDetail = await api.callMethod("GET", `blog/${slug}`, {});
		},
		async searchOptions(search) {
			const res = await api.callMethod("GET", `blog/search?q=${search}&entity=articles`, {});
			if (res?.length > 0) {
				return res;
			}
			return [{ label: { text: "Не найдено" } }];
		},
		async showMore() {
			this.canUpdate = false;
			console.log(this.page + 1 > this.countPages);
			if (this.page + 1 > this.countPages) {
				this.canUpdate = true;
				return;
			}
			this.page++;
			const categoryId = this.categories?.find((category) => category.slug == route.params.category)?.id;
			const newArticles = await api.callMethod("GET", `blog?page=${this.page}&per_page=${this.perPage}&q=${categoryId ? `&filter[category_id]=${categoryId}` : ""}`);
			if (newArticles?.list?.data?.length > 0) {
				this.articles.list.data = [...this.articles.list.data, ...newArticles.list.data];
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
		paths: ["lastModifiedCache", "cachedCategories", "cachedArticles", "lastTimeCategory", "lastTimePage", "lastTimePerPage"],
	},
});
