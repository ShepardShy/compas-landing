import { defineStore } from "pinia";
import api from "~/helpers/api.js";

const route = useRoute();

export const useKnowledgeStore = defineStore("knowledgeStore", {
	state: () => ({
		articles: null,
		articleDetail: null,
		categories: null,
		page: 1,
		perPage: 12,
		canUpdate: true,
	}),
	getters: {
		currentTitle() {
			if (!this?.categories) return null;
			const activeChild = this.activeChild;
			if (activeChild) {
				return activeChild.mainTitle;
			}
			const category = this.categories.find((category) => (route.fullPath.includes(category.slug) ? category : null));

			return category ? category.name : "База знаний";
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
			if (route.params?.id) {
				return this.articles?.list?.data.filter((i) => i.slug != route.params.id && i?.slug?.value != route.params.id) || [];
			}
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
			return this.articles?.list.last_page;
		},
	},
	actions: {
		async loadArticles() {
			if (this.canUpdate) {
				const { categories } = await api.callMethod("GET", `knowledge`, {});
				this.categories = categories;
				const categoryId = this.categories?.find((category) => category.slug == route.params.category)?.id;
				this.articles = await api.callMethod("GET", `knowledge?page=${this.page}&per_page=${this.perPage}&q=${categoryId ? `&filter[category_id]=${categoryId}` : ""}`, {});

				if (this.page > this.countPages) {
					this.page = 1;
				}
			}
		},
		async loadArticle(slug) {
			this.articleDetail = await api.callMethod("GET", `knowledge/${slug}`, {});
		},
		async searchOptions(search) {
			const res = await api.callMethod("GET", `knowledge/search?q=${search}&entity=knowledge`, {});
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
});
