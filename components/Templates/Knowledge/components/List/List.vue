<template>
	<div class="articles__list">
		<template v-for="{ name, views, slug, preview_picture, created_at, detail_text } in articlesList">
			<KnowledgeItem
				v-if="name"
				:date="created_at"
				:id="slug.value ? slug.value : slug"
				:title="name"
				:views
				:text="detail_text[0].body"
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
		class="articles__list-pagination"
	/>
</template>

<script setup>
	import KnowledgeItem from "~/components/Templates/Common/KnowledgeItem/KnowledgeItem.vue";
	import AppPagination from "~/components/AppPagination/AppPagination.vue";
	import { storeToRefs } from "pinia";
	import { useKnowledgeStore } from "~/stores/knowledgeStore";

	const knowledgeStore = useKnowledgeStore();

	const { page, perPage, countPages } = storeToRefs(knowledgeStore);

	const showMore = () => {
		knowledgeStore.showMore();
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
	@import url("./List.scss");
</style>
