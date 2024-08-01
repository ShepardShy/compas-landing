<template>
	<div class="questions">
		<div class="questions__left">
			<Search />
			<AppNav
				class="questions__nav"
				title="Вопрос-ответ"
				:categories
				path="questions"
			/>
			<AskQuestion />
		</div>
		<div class="questions__right">
			<template v-if="!questionId">
				<Title />
				<QuestionsList />
			</template>
			<Question
				v-else
				:answer
				:image
				:title
				:views
				:date
			/>
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
	import Question from "~/components/Templates/Common/QuestionFull/QuestionFull.vue";

	import question from "./question.json";
	const { answer, date, image, title, views } = question;

	const route = useRoute();

	const questionsStore = useQuestionsStore();
	const { categories } = storeToRefs(questionsStore);

	const questionId = computed(() => route.params.id);
</script>

<style scoped>
	@import url("./Questions.scss");
</style>
