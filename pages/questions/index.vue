<template>
	<TemplateQuestions />
</template>

<script setup>
	import TemplateQuestions from "@/components/Templates/Questions/Questions.vue";

	useHead({
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/questions`,
			},
		],
	});
</script>
