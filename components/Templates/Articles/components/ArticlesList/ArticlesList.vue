<template>
	<div class="articles__list">
		<ArticleItem
			:date
			:id
			:image
			:text
			:views
			:value
			v-for="{ date, id, image, text, views, value } in articles"
		/>
	</div>
	<AppPagination
		:totalPages
		v-model="activePage"
		class="articles__list-pagination"
	/>
</template>

<script setup>
	import ArticleItem from "~/components/Templates/Common/ArticleItem/ArticleItem.vue";
	import AppPagination from "~/components/AppPagination/AppPagination.vue";
	import articlesJson from "./articles.json";

	const totalPages = ref(66);
	const activePage = ref(1);

	const articles = ref(articlesJson);
</script>

<style>
	@import url("./ArticlesList.scss");
</style>
