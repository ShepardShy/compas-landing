import { defineStore } from "pinia";
import categories from "./data/categories.js";
import api from "~/helpers/api.js";

const route = useRoute();

export const useArticlesStore = defineStore("articlesStore", {
	state: () => ({
		articles: null,
		articleDetail: null,
		categories: null,
		page: 1,
		perPage: 25,
	}),
	getters: {
		currentTitle() {
			console.log(this.categories);

			if (!this?.categories) return null;
			const activeChild = this.activeChild;
			if (activeChild) {
				return activeChild.mainTitle;
			}
			const category = this.categories.find(category => (route.fullPath.includes(category.slug) ? category : null));

			return category ? category.name : this.categories[0].name;
		},

		activeChild: state => {
			if (!state?.categories) return null;
			for (const category of state.categories) {
				const child = category.children?.find(child => route.fullPath.includes(child.value));
				if (child) {
					return child;
				}
			}
			return null;
		},

		articlesList() {
			return this.articles?.list?.data || [];
		},

		articlesCategories() {
			return this.categories?.map(category => ({
				id: category.id,
				value: category.slug,
				title: category.name,
				isOpen: false,
				children: category.children?.map(child => ({
					id: child.id,
					value: child.slug,
					title: child.name,
				})),
			}));
		},

		currentCategoryId() {
			return this.categories?.find(category => category.slug == route.params.id)?.id;
		},

		countPages() {
			return this.articles?.list.last_page;
		},
	},
	actions: {
		async loadArticles() {
			this.categories = (await api.callMethod("GET", `blog`, {})).categories;
			const categoryId = this.categories?.find(category => category.slug == route.params.id)?.id;
			this.articles = await api.callMethod("GET", `blog?q=&filter[category_id]=${categoryId}`, {});
		},
		async loadArticle(slug) {
			this.articleDetail = await api.callMethod("GET", `blog/${slug}`, {});
		},
		async searchOptions(search) {
			return await fetch(`blog/search?q=${search}&entity=articles`, { method: "GET" });
		},
	},
});
