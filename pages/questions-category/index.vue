<template>
	<TemplateQuestions />
</template>

<script setup>
	import TemplateQuestions from "@/components/Templates/Questions/Questions.vue";

	// Мета теги

	useHead({
		link: [
			{
				rel: "canonical",
				href: "https://compas.pro/questions-category",
			},
		],
	});
</script>
