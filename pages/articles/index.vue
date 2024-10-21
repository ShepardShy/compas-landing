<template>
	<TemplateArticles />
</template>

<script setup>
	import TemplateArticles from "@/components/Templates/Articles/Articles.vue";

	// Мета теги
	useHead({
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/articles`,
			},
		],
	});
</script>
