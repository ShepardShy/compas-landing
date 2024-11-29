import { defineStore } from "pinia";
import api from "~/helpers/api.js";
import { useGlobalStore } from "~/stores/globalStore";

const route = useRoute();

export const useGuidesStore = defineStore("guidesStore", {
	state: () => ({
		guides: null,
		guideDetail: null,
		cachedGuideDetails: [],
		categories: null,
		page: 1,
		perPage: 12,
		canUpdate: true,
		lastModifiedCache: null, // Дата последнего изменения с сервера
		cachedGuides: null, // Закэшированные данные гайдов
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

			return category ? category.name : "Гайды";
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

		guidesList() {
			// if (route.params?.id) {
			// 	return this.guides?.list?.data.filter((i) => i.slug != route.params.id && i?.slug?.value != route.params.id) || [];
			// }
			return this.guides?.list?.data || [];
		},

		guidesCategories() {
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
			return this.guides?.list?.last_page;
		},
	},
	actions: {
		async loadGuides(categoryParam) {
			if (this.canUpdate) {
				this.guides = [];
				const globalStore = useGlobalStore();
				const lastModified = globalStore.lastModified;
				if (
					this.lastModifiedCache === lastModified.guides &&
					this.cachedGuides &&
					this.cachedCategories &&
					categoryParam == this.lastTimeCategory &&
					this.lastTimePage == this.page &&
					this.lastTimePerPage == this.perPage
				) {
					// Используем кэшированные данные
					this.guides = this.cachedGuides;
					this.categories = this.cachedCategories;
				} else {
					// Загружаем новые данные
					const { categories } = await api.callMethod("GET", `guides`, {});
					this.categories = categories;
					const categoryId = this.categories?.find((category) => category.slug == categoryParam)?.id;
					const resGuides = await api.callMethod("GET", `guides?page=${this.page}&per_page=${this.perPage}&q=${categoryId ? `&filter[category_id]=${categoryId}` : ""}`, {});
					this.guides = resGuides;

					// Обновляем кэш
					this.lastTimeCategory = categoryParam;
					this.cachedGuides = resGuides;
					this.cachedCategories = this.categories;
					this.lastModifiedCache = lastModified.guides;
					this.lastTimePage = this.page;
					this.lastTimePerPage = this.perPage;
				}

				if (this.page > this.countPages) {
					this.page = 1;
				}
			}
		},
		async loadGuide(slug) {
			this.guideDetail = await api.callMethod("GET", `guides/${slug}`, {});
			// this.cachedGuideDetails =
			// this.guideDetail = await api.callMethod("GET", `guides/${slug}`, {});
		},
		async searchOptions(search) {
			const res = await api.callMethod("GET", `guides/search?q=${search}&entity=guides`, {});
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
			const newGuides = await api.callMethod("GET", `guides?page=${this.page}&per_page=${this.perPage}&q=${categoryId ? `&filter[category_id]=${categoryId}` : ""}`);
			if (newGuides?.list?.data?.length > 0) {
				this.guides.list.data = [...this.guides.list.data, ...newGuides.list.data];
			}
			console.log("showMore end");
			this.canUpdate = true;
		},
	},
	persist: {
		afterRestore: (ctx) => {
			console.log(`about to restore 'commonStore'`);
			// ctx.store.lastModified = null,
		},
		storage: persistedState.localStorage,
		paths: ["lastModifiedCache", "cachedCategories", "cachedGuides", "lastTimeCategory", "lastTimePage", "lastTimePerPage"],
	},
});
