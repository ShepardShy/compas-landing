<template>
	<TemplateQuestions />
</template>

<script setup>
	import TemplateQuestions from "@/components/Templates/Questions/Questions.vue";

	const route = useRoute();

	useHead({
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/questions/${route.params.id}`,
			},
		],
	});
</script>
