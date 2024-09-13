<template>
	<div class="articles__list">
		<ArticleItem
			:date="created_at"
			:id="slug.value"
			:image="preview_picture[0]?.file"
			:title="preview_text"
			:views
			v-for="{ preview_text, views, slug, preview_picture, created_at } in articles"
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
	import articlesJson from "../../articles.js";

	const totalPages = ref(66);
	const activePage = ref(1);

	const props = defineProps({
		articlesList: {
			type: Array,
			required: true,
			default: [],
		},
	});
	const articles = ref(props.articlesList);
</script>

<style>
	@import url("./ArticlesList.scss");
</style>
