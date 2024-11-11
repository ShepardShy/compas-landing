<template>
	<TemplateTariffs />
</template>

<script setup>
	import TemplateTariffs from "@/components/Templates/Tariffs/Tariffs.vue";

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
		title: "Тарифы на услуги отслеживания штрафов и управления автопарком | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Сравните тарифы на услуги отслеживания штрафов, управления автопарком и сотрудниками. Узнайте, какой план подходит именно вам — от бесплатного до профессионального тарифа с минимальной комиссией за оплату штрафов.",
			},
		]
	});
</script>
