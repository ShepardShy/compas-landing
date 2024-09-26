<template>
	<div class="articles__list">
		<template v-for="{ preview_text, views, slug, preview_picture, created_at } in articlesList">
			<ArticleItem
				v-if="preview_text"
				:date="created_at"
				:id="slug.value ? slug.value : slug"
				:image="preview_picture[0]?.file"
				:title="preview_text"
				:views
			/>
		</template>
	</div>
	<AppPagination
		:totalPages="countPages"
		:perPageOptions
		:perPage
		v-model="page"
		v-model:perPage="perPage"
		@showMore="showMore"
		class="articles__list-pagination"
	/>
</template>

<script setup>
	import ArticleItem from "~/components/Templates/Common/ArticleItem/ArticleItem.vue";
	import AppPagination from "~/components/AppPagination/AppPagination.vue";
	import articlesJson from "../../articles.js";
	import { storeToRefs } from "pinia";
	import { useArticlesStore } from "~/stores/articlesStore";

	const articlesStore = useArticlesStore();

	const { page, perPage, countPages } = storeToRefs(articlesStore);

	const showMore = () => {
		articlesStore.showMore();
	};

	const perPageOptions = [
		{
			label: "12",
			value: 12,
		},
		{
			label: "24",
			value: 24,
		},
		{
			label: "36",
			value: 36,
		},
	];

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
