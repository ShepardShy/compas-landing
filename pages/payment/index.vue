<template><Payment /></template>

<script setup>
	import Payment from "~/components/Templates/Payment/Payment.vue";

	// Мета теги
	useHead({
		title: "Ваш платеж в обработке",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
			{
				name: "robots",
				content: "noindex, nofollow",
			},
		],
	});

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

<style lang="scss" scoped></style>
