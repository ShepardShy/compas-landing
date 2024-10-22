<template>
	<TemplateQuestions />
</template>

<script setup>
	import TemplateQuestions from "@/components/Templates/Questions/Questions.vue";
	import { useQuestionsStore } from "~/stores/questionsStore";

	const questionsStore = useQuestionsStore();

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

	useHead({
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/questions-category/${route.params.category}`,
			},
		],
	});
</script>
