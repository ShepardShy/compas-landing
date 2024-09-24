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
		v-model="page"
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
