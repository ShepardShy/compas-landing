<template>
	<Distance />
</template>

<script setup>
	import Distance from "~/components/Templates/Distance/Distance.vue";
	import meta from "/assets/json/distance/meta.json";

	const route = useRoute();

	// Мета теги
	useHead({
		title: `${meta[route.params.tab].title} | Compas.pro`,
		meta: [
			{
				name: "description",
				content: `${meta[route.params.tab].description}`,
			},
		],
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/products/distance/${route.params.tab}`,
			},
		],
	});
</script>
