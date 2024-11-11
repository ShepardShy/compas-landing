<template>
	<DocsList />
</template>

<script setup>
	import DocsList from "@/components/Templates/Docs/List/List.vue";

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

	useHead({
		title: "Документы и Юридическая Информация сервиса Compas.pro | Compas.pro",
		meta: [
			{
				name: "description",
				content: "В разделе представлены публичная оферта, политика конфиденциальности и другие важные документы для пользователей проекта Compas.pro.",
			},
		]
	});
</script>
