<template>
	<TemplateQuestions />
</template>

<script setup>
	import TemplateQuestions from "@/components/Templates/Questions/Questions.vue";

	// Мета теги
	useHead({
		title: "Вопросы ответы . Компас",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});
</script>
