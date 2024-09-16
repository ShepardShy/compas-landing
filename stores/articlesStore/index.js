import { defineStore } from "pinia";
import categories from "./data/categories.js";
import api from "~/helpers/api.js";

const route = useRoute();

export const useArticlesStore = defineStore("articlesStore", {
	state: () => ({
		articles: null,
		articleDetail: null,
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

		articlesList() {
			return this.articles?.list?.data || [];
		},
	},
	actions: {
		async loadArticles() {
			this.articles = await api.callMethod("GET", "blog", {});
		},
		async loadArticle(slug) {
			this.articleDetail = await api.callMethod("GET", `blog/${slug}`, {});
		},
	},
});
