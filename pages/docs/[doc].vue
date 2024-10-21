<template>
	<DocsContent />
</template>

<script setup>
	import DocsContent from "@/components/Templates/Docs/Content/Content.vue";

	const route = useRoute();

	useHead({
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/docs/${route.params.doc}`,
			},
		],
	});
</script>
