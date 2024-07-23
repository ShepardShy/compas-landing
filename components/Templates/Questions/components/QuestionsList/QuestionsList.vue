<template>
	<div class="questions__list">
		<QuestionItem
			:title="question.title"
			:subtitle="question.subtitle"
			:image="question.image"
			:views="question.views"
			v-for="question in questions"
		/>
	</div>
</template>

<script setup>
	import QuestionItem from "@/components/Templates/Common/QuestionItem/QuestionItem.vue";
	import questionsJson from "./questions.json";

	const questions = ref(questionsJson);
</script>

<style>
	@import url("./QuestionsList.scss");
</style>
