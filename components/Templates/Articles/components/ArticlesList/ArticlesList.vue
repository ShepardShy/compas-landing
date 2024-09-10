<template>
	<div class="articles__list">
		<ArticleItem
			:date="created_at"
			:id="slug"
			:image="imageMini"
			:title="preview_text"
			:views
			v-for="{ slug, created_at, id, imageMini, preview_text, views } in articlesList"
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
	// import articlesJson from "../../articles.js";

	const totalPages = ref(66);
	const activePage = ref(1);

	const props = defineProps({
		articlesList: {
			type: Array,
			required: true,
			default: [],
		},
	});
	const { articlesList } = toRefs(props);
</script>

<style>
	@import url("./ArticlesList.scss");
</style>
