<template>
	<div class="guides__list">
		<template v-for="{ name, views, slug, preview_picture, created_at, video } in list">
			<GuideItem
				v-if="name"
				:date="created_at"
				:id="slug.value ? slug.value : slug"
				:image="preview_picture[0]?.file"
				:title="name"
				:views
				:video
			/>
		</template>
	</div>
	<AppPagination
		v-if="countPages > 1"
		:totalPages="countPages"
		:perPageOptions
		:perPage
		v-model="page"
		v-model:perPage="perPage"
		@showMore="showMore"
		class="guides__list-pagination"
	/>
</template>

<script setup>
	import GuideItem from "~/components/Templates/Common/GuideItem/GuideItem.vue";
	import AppPagination from "~/components/AppPagination/AppPagination.vue";
	import { storeToRefs } from "pinia";
	import { useGuidesStore } from "~/stores/guidesStore";

	const articlesStore = useGuidesStore();

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
		list: {
			type: Array,
			required: true,
			default: [],
		},
	});
	const { list } = toRefs(props);
</script>

<style>
	@import url("./List.scss");
</style>
