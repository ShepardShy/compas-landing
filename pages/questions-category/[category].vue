<template>
	<TemplateQuestions />
</template>

<script setup>
	import TemplateQuestions from "@/components/Templates/Questions/Questions.vue";
	import { storeToRefs } from "pinia";
	import { useQuestionsStore } from "~/stores/questionsStore";

	const questionsStore = useQuestionsStore();
	const { questionsCategories } = storeToRefs(questionsStore);

	const route = useRoute();

	watch(
		() => route.params.category,
		async () => {
			await questionsStore.loadQuestions();
		},
		{ deep: true, immediate: true }
	);
	onUnmounted(async () => {
		await questionsStore.loadQuestions();
	});

	watchEffect(() => {
		const category = questionsCategories.value?.find((category) => category.slug == route.params.category);
		if (category) {
			useHead({
				title: category?.seo_title + " | Вопрос-ответ | Compas.pro",
				meta: [
					{
						name: "description",
						content: category?.seo_description,
					},
				],
			});
		}
	});

	useHead({
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/questions-category/${route.params.category}`,
			},
		],
	});
</script>
