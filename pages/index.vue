<template>
	<TemplateMain /> 
</template>

<script setup>
	import TemplateMain from "@/components/Templates/MainPage/Main.vue";

	const config = useRuntimeConfig();
	const route = useRoute()
	const canonicalUrl = ref(null)
	
	onMounted(() => {
		canonicalUrl.value = `${config.public.baseURL}${route.path.replace('/landing', '')}`;

		// Мета теги
		useHead({
			title: "Онлайн-сервис для управление автопарком | Compas.pro",
			meta: [
				{
					name: "description",
					content: "Compas.pro — удобный онлайн-сервис для управления автопарком. Контролируйте состояние автопарка в одном месте и экономьте время и деньги!",
				},
			],
			link: [
				{
					rel: 'canonical',
					href: canonicalUrl.value,
				},
			],
		});
	})

	
	// <link rel="canonical" href="https://compas.pro/">
</script>
