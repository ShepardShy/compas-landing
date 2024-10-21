<template>
	<KnowledgeOne />
</template>

<script setup>
	import KnowledgeOne from "@/components/Templates/KnowledgeOne/KnowledgeOne.vue";

	const route = useRoute();

	// Мета теги
	useHead({
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/knowledge/${route.params.id}`,
			},
		],
	});
</script>
