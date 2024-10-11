<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div class="articles">
		<div class="articles__left">
			<Search
				class="articles__search"
				@changeValue="changeValueSearch"
				placeholder="Поиск по статьям"
				:options="searchOptions"
			/>
			<AppNav
				v-if="articlesCategories"
				title="Статьи"
				:categories="articlesCategories"
				path="articles-category"
			/>
		</div>
		<div class="articles__right">
			<Title :title="currentTitle" />
			<ArticlesList :articlesList />
		</div>
	</div>
</template>

<script setup>
	import Search from "./components/Search/Search.vue";
	import Title from "./components/Title/Title.vue";
	import ArticlesList from "./components/ArticlesList/ArticlesList.vue";
	import { storeToRefs } from "pinia";
	import { useArticlesStore } from "~/stores/articlesStore";
	import AppNav from "~/components/AppNav/AppNav.vue";

	const route = useRoute();

	const articlesStore = useArticlesStore();

	const { categories, page, countPages, currentCategory, perPage, articlesCategories, currentTitle, articlesList, articles, currentCategoryId, options } = storeToRefs(articlesStore);

	page.value = 1;
	perPage.value = 12;
	await articlesStore.loadArticles();

	watchEffect(async () => {
		route.params.category;
		await articlesStore.loadArticles();
	});

	watch(
		() => [page.value, perPage.value],
		() => {
			articlesStore.loadArticles();
		}
	);

	watch(
		() => currentCategoryId.value,
		async () => {
			await articlesStore.loadArticles();
		}
	);

	// if (route.params?.category) {
	// 	const category = articlesCategories.value?.find(category => category.slug == route.params.category);
	// 	if (!category) {
	// 		await navigateTo("/404");
	// 	}
	// }
	// watchEffect(async () => {
	// 	if (route.params?.category) {
	// 		const category = articlesCategories.value?.find(category => category.slug == route.params.category);
	// 		if (!category) {
	// 			await navigateTo("/404");
	// 		}
	// 	}
	// });

	const searchOptions = ref([]);
	const changeValueSearch = async search => {
		if (search.value) {
			await navigateTo(`/articles/${search.value}`);
			return;
		}

		searchOptions.value = await articlesStore.searchOptions(search);
		searchOptions.value = searchOptions.value.map(i => {
			return { ...i, value: i.label.slug };
		});
	};

	watchEffect(() => {
		const category = articlesCategories.value.find(category => category.slug == route.params.category);
		if (category) {
			useHead({
				title: category?.seo_title + " | Статьи | Compas.pro",
				meta: [
					{
						name: "description",
						content: category?.seo_description,
					},
				],
			});
			return;
		}
		// Мета теги
		useHead({
			title: "Полезные статьи об эффективном управлении автопарком | Compas.pro",
			meta: [
				{
					name: "description",
					content: "Читайте наш блог на Compas.pro — здесь собраны полезные статьи и советы для эффективного управления автопарком. Как контролировать водителей и автомобили и экономить на управлении.",
				},
			],
		});
	});

	let breadcrumbs = [
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Статьи",
			link: "/products/fines",
		},
	];
</script>

<style scoped>
	@import url("./Articles.scss");
</style>
