<template><TemplateKnowledge /></template>

<script setup>
	import TemplateKnowledge from "@/components/Templates/Knowledge/Knowledge.vue";

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
				href: `https://compas.pro/knowledge-category/${route.params.category}`,
			},
		],
	});
</script>
