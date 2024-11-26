<template>
	<div class="questions__list">
		<template v-for="{ created_at, slug, detail_picture, detail_text, name, views } in questionsList">
			<QuestionItem
				v-if="detail_text"
				:date="created_at"
				:title="name"
				:answer="detail_text?.[0]?.body"
				:image="detail_picture?.[0]?.file"
				:views
				:id="slug?.value ?? slug"
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
		class="questions__list-pagination"
	/>
</template>

<script setup>
	import QuestionItem from "@/components/Templates/Common/QuestionItem/QuestionItem.vue";
	import AppPagination from "~/components/AppPagination/AppPagination.vue";

	import { storeToRefs } from "pinia";
	import { useQuestionsStore } from "~/stores/questionsStore";

	const questionsStore = useQuestionsStore();

	const { page, perPage, countPages, questionsList } = storeToRefs(questionsStore);
	page.value = 1;
	perPage.value = route.query.per_page ?? 12;

	const showMore = () => {
		questionsStore.showMore();
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
</script>

<style>
	@import url("./QuestionsList.scss");
</style>
