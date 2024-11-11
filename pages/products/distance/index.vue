<template>
	<Distance />
</template>

<script setup>
	import Distance from "~/components/Templates/Distance/Distance.vue";

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
		title: "Расчёт расстояния | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		]
	});
</script>
