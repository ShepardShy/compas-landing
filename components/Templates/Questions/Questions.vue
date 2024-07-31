<template>
	<div class="questions">
		<div class="questions__left">
			<Search />
			<AppNav
				class="questions__nav"
				title="Вопрос-ответ"
				:categories="categories"
				path="questions"
			/>
			<AskQuestion />
		</div>
		<div class="questions__right">
			<Title />
			<QuestionsList />
		</div>
	</div>
</template>

<script setup>
	import Search from "./components/Search/Search.vue";
	import Title from "./components/Title/Title.vue";
	import AskQuestion from "./components/AskQuestion/AskQuestion.vue";
	import QuestionsList from "./components/QuestionsList/QuestionsList.vue";
	import { storeToRefs } from "pinia";
	import { useQuestionsStore } from "~/stores/questionsStore";
	import AppNav from "~/components/AppNav/AppNav.vue";

	const questionsStore = useQuestionsStore();
	const { categories } = storeToRefs(questionsStore);
</script>

<style scoped>
	@import url("./Questions.scss");
</style>
