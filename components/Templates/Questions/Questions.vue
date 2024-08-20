<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />

	<div
		class="questions"
		:class="{ question_open: questionId }"
	>
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
	const { answer, date, image, title, views, meta } = question;

	const route = useRoute();

	const questionsStore = useQuestionsStore();
	const { categories } = storeToRefs(questionsStore);

	const questionId = computed(() => route.params.id);

	watchEffect(() => {
		if (questionId.value) {
			useHead({
				title: meta.title + " | Compas.pro",
				meta: [
					{
						name: "description",
						content: meta.description,
					},
				],
			});
			return;
		}
		useHead({
			title: "Вопросы и ответы — Часто задаваемые вопросы о штрафах и ПДД | Compas.pro",
			meta: [
				{
					name: "description",
					content: "Найдите ответы на самые частые вопросы о штрафах, правилах дорожного движения и правах водителей на странице 'Вопросы и ответы' Compas.pro. Мы поможем разобраться в сложных ситуациях и избежать ошибок.",
				},
			],
		});
	});

	let breadcrumbs = computed(() => [
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Вопрос-ответ",
			link: "/questions",
		},
		questionId.value
			? {
					title: title,
					link: `/questions/${questionId.value}`,
			  }
			: null,
	]);
</script>

<style scoped>
	@import url("./Questions.scss");
</style>
