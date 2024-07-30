<template>
	<TemplateArticles />
</template>

<script setup>
	import TemplateArticles from "@/components/Templates/Articles/Articles.vue";

	// Мета теги
	useHead({
		title: "Вопросы ответы | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});
</script>
