<template>
	<Distance />
</template>

<script setup>
	import Distance from "~/components/Templates/Distance/Distance.vue";
	import meta from "/assets/json/distance/meta.json";

	const config = useRuntimeConfig();
	const route = useRoute()
	const canonicalUrl = ref(null)
	
	onMounted(() => {
		canonicalUrl.value = `${config.public.baseURL}${route.path.replace('/landing', '')}`;

		// Мета теги
		useHead({
			link: [
				{
					rel: 'canonical',
					href: canonicalUrl.value,
				},
			],
		});
	})

	// Мета теги
	useHead({
		title: `${meta[route.params.tab].title} | Compas.pro`,
		meta: [
			{
				name: "description",
				content: `${meta[route.params.tab].description}`,
			},
		]
	});
</script>
