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
			console.log(1231232);
			questionsStore.loadQuestions();
		},
		{ deep: true, immediate: true }
	);
	onUnmounted(() => {
		questionsStore.loadQuestions();
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
