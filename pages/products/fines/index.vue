<template>
	<TemplateMain />
</template>

<script setup>
	import TemplateMain from "@/components/Templates/Main/Main.vue";


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
		title: "Проверка и оплата штрафов ГИБДД онлайн | Compas.pro",
		meta: [
			{
				name: "description",
				content:
					"Быстрая проверка и оплата штрафов ГИБДД онлайн. Удобный сервис для поиска и оплаты штрафов. Экономьте время и избегайте проблем с нашими безопасными и надежными онлайн-платежами.",
			},
		]
	});
</script>
