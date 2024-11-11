<template><ArticleOne /></template>

<script setup>
	import ArticleOne from "@/components/Templates/ArticleOne/ArticleOne.vue";

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
</script>
