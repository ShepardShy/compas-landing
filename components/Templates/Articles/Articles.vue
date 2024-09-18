<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div class="articles">
		<div class="articles__left">
			<Search />
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

	const { categories, articlesCategories, currentTitle, articlesList, articles } = storeToRefs(articlesStore);
	console.log(articlesCategories.value);

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
