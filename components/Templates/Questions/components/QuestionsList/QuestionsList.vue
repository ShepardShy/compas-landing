<template>
	<div class="questions__list">
		<QuestionItem
			:date
			:title
			:answer
			:image
			:views
			:id
			v-for="{ date, id, image, answer, title, views } in questions"
		/>
	</div>
	<AppPagination
		:totalPages
		v-model="activePage"
		class="questions__list-pagination"
	/>
</template>

<script setup>
	import QuestionItem from "@/components/Templates/Common/QuestionItem/QuestionItem.vue";
	import AppPagination from "~/components/AppPagination/AppPagination.vue";

	const props = defineProps({
		questions: { type: Array, required: true },
	});

	const totalPages = ref(66);
	const activePage = ref(1);
</script>

<style>
	@import url("./QuestionsList.scss");
</style>
