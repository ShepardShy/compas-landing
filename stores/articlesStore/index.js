import { defineStore } from "pinia";
import categories from "./data/categories.js";
import api from "~/helpers/api.js";

const route = useRoute();

export const useArticlesStore = defineStore("articlesStore", {
	state: () => ({
		articles: null,
		articleDetail: null,
		categories: null,
	}),
	getters: {
		currentTitle() {
			if (!this?.categories) return null;
			const activeChild = this.activeChild;
			if (activeChild) {
				return activeChild.mainTitle;
			}
			const category = this.categories.find(category => (route.fullPath.includes(category.value) ? category : null));
			return category ? category.mainTitle : this.categories[0].mainTitle;
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
		async loadArticles() {
			this.articles = await api.callMethod("GET", "blog", {});
			this.categories = this.articles.categories;
		},
		async loadArticle(slug) {
			this.articleDetail = await api.callMethod("GET", `blog/${slug}`, {});
		},
	},
});
