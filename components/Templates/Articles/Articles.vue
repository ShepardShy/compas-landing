<template>
	<div class="articles">
		<div class="articles__left">
			<Search />
			<AppNav
				title="Статьи"
				:categories="categories"
				path="articles"
			/>
		</div>
		<div class="articles__right">
			<Title :title="currentTitle" />
			<articlesList />
		</div>
	</div>
</template>

<script setup>
	import Search from "./components/Search/Search.vue";
	import Title from "./components/Title/Title.vue";
	import articlesList from "./components/ArticlesList/ArticlesList.vue";
	import { storeToRefs } from "pinia";
	import { useArticlesStore } from "~/stores/articlesStore";
	import AppNav from "~/components/AppNav/AppNav.vue";

	const articlesStore = useArticlesStore();
	const { categories, currentTitle } = storeToRefs(articlesStore);
</script>

<style scoped>
	@import url("./Articles.scss");
</style>
