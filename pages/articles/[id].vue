<template><ArticleOne /></template>

<script setup>
	import ArticleOne from "@/components/Templates/ArticleOne/ArticleOne.vue";

	const route = useRoute();

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
				href: `https://compas.pro/articles/${route.params.id}`,
			},
		],
	});
</script>
