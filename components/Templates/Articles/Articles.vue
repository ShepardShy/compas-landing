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

	const articlesStore = useArticlesStore();

	await articlesStore.loadArticles();

	const { categories, page,countPages, perPage, articlesCategories, currentTitle, articlesList, articles, currentCategoryId, options } = storeToRefs(articlesStore);

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
