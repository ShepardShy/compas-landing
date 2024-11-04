<template>
	<TemplateGuides />
</template>

<script setup>
	import TemplateGuides from "@/components/Templates/Guides/Guides.vue";

	// Мета теги
	useHead({
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/guides`,
			},
		],
	});
</script>
