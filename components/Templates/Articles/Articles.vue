<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div class="articles">
		<div class="articles__left">
			<Search
				@changeValue="changeValueSearch"
				placeholder="Поиск по статьям"
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

	const { categories, articlesCategories, currentTitle, articlesList, articles, currentCategoryId } = storeToRefs(articlesStore);

	watch(
		() => currentCategoryId.value,
		async () => {
			await articlesStore.loadArticles();
		}
	);

	const changeValueSearch = async search => {
		const res = articlesStore.searchOptions(search);
		console.log(await res);
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
