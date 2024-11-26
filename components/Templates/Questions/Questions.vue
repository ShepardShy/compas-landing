<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />

	<div
		class="questions"
		:class="{ question_open: questionId }"
	>
		<div class="questions__left">
			<Search
				class="questions__search"
				@changeValue="changeValueSearch"
				placeholder="Поиск по вопросам"
				:options="searchOptions"
			/>
			<AppNav
				v-if="questionsCategories"
				class="questions__nav"
				title="Вопрос-ответ"
				:categories="questionsCategories"
				path="questions-category"
			/>
			<AskQuestion />
		</div>
		<div class="questions__right">
			<template v-if="!questionId">
				<Title :title="currentTitle" />
				<QuestionsList v-if="questionsList" />
			</template>
			<Question
				v-else-if="questionDetail"
				:answer="questionDetail?.detail_text.value?.[0].body"
				:image="questionDetail?.detail_picture.value?.[0]?.file"
				:title="questionDetail?.name?.value"
				:views="questionDetail?.views?.value"
				:date="questionDetail?.created_at?.value"
				:id="questionDetail?.slug?.value.value"
				:readingTime="questionDetail?.reading_time?.value"
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
	// import questions from "./questions.json";

	const route = useRoute();

	const questionsStore = useQuestionsStore();
	const { questionsCategories, questionsList, questionDetail, page, perPage, currentCategory } = storeToRefs(questionsStore);

	page.value = route.query.page ?? 1;
	perPage.value = route.query.per_page ?? 12;

	watch(
		() => [page.value, perPage.value],
		async () => {
			await questionsStore.loadQuestions();
		}
	);

	const questionId = computed(() => route.params.id);
	questionDetail.value = null;
	await useAsyncData("question", async () => (questionId.value ? await questionsStore.loadQuestion(route.params.id) : 0));
	await useAsyncData("questions", async () => (!questionsList.value.length ? await questionsStore.loadQuestions() : 0));

	const searchOptions = ref([]);
	const changeValueSearch = async (search) => {
		if (search.value) {
			await navigateTo(`/questions/${search.value}`);
			return;
		}

		searchOptions.value = await questionsStore.searchOptions(search);
		searchOptions.value = searchOptions.value.map((i) => {
			return { ...i, value: i.label.slug };
		});
	};

	watchEffect(() => {
		if (questionId.value) {
			console.log(questionDetail.value, "questionDetail");

			useHead({
				title: questionDetail.value?.seo_title?.value?.value ?? questionDetail.value?.seo_title?.value + " | Вопрос-ответ | Compas.pro",
				meta: [
					{
						name: "description",
						content: questionDetail.value?.seo_description?.value?.value ?? questionDetail.value?.seo_description?.value,
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
					content:
						"Найдите ответы на самые частые вопросы о штрафах, правилах дорожного движения и правах водителей на странице 'Вопросы и ответы' Compas.pro. Мы поможем разобраться в сложных ситуациях и избежать ошибок.",
				},
			],
		});
	});

	let breadcrumbs = computed(() => {
		const category = questionsCategories.value?.find((category) => category.slug == route.params.category);
		return [
			{
				title: "Главная страница",
				link: "/",
			},
			{
				title: "Вопрос-ответ",
				link: "/questions",
			},
			category
				? {
						title: category.title,
						link: `/questions-category/${category.slug}`,
				  }
				: null,
			questionId.value
				? {
						title: questionDetail.value?.name.value,
						link: `/questions/${questionId.value}`,
				  }
				: null,
		];
	});
</script>

<style scoped>
	@import url("./Questions.scss");
</style>
