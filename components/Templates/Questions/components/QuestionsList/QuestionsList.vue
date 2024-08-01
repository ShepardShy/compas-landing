<template>
	<div class="questions__list">
		<QuestionItem
			:date
			:title
			:subtitle
			:image
			:views
			:id
			v-for="{ date, id, image, subtitle, title, views } in questions"
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
	import questionsJson from "./questions.json";

	const totalPages = ref(66);
	const activePage = ref(1);

	const questions = ref(questionsJson);
</script>

<style>
	@import url("./QuestionsList.scss");
</style>
