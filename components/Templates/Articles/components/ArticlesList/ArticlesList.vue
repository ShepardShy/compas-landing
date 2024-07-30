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
</template>

<script setup>
	import articlesJson from "./articles.json";
	import ArticleItem from "~/components/Templates/Common/ArticleItem/ArticleItem.vue";

	const articles = ref(articlesJson);
</script>

<style>
	@import url("./ArticlesList.scss");
</style>
