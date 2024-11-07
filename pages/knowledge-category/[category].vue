<template><TemplateKnowledge /></template>

<script setup>
	import TemplateKnowledge from "@/components/Templates/Knowledge/Knowledge.vue";
	import { useKnowledgeStore } from "~/stores/knowledgeStore";

	const knowledgeStore = useKnowledgeStore();

	const route = useRoute();

	watch(
		() => route.params.category,
		async () => {
			await knowledgeStore.loadArticles();
		},
		{ deep: true, immediate: true }
	);
	onUnmounted(async () => {
		await knowledgeStore.loadArticles();
	});

	// Мета теги
	useHead({
		// title: "Вопросы ответы | Compas.pro",
		// meta: [
		// 	{
		// 		name: "description",
		// 		content: "Описание.",
		// 	},
		// ],
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/knowledge-category/${route.params.category}`,
			},
		],
	});
</script>
