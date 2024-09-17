<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div class="articles">
		<div class="articles__left">
			<Search />
			<AppNav
				title="Статьи"
				:categories="categories"
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
	const { categories, currentTitle, articlesList } = storeToRefs(articlesStore);

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

	articlesStore.loadArticles();
</script>

<style scoped>
	@import url("./Articles.scss");
</style>
