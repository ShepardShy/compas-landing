<template>
	<TemplateMain />
</template>

<script setup>
	import TemplateMain from "@/components/Templates/MainPage/Main.vue";

	// Мета теги

	useHead({
		title: "Онлайн-сервис для управление автопарком | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Compas.pro — удобный онлайн-сервис для управления автопарком. Контролируйте состояние автопарка в одном месте и экономьте время и деньги!",
			},
		],
		link:[{
			rel:'canonical',
			href:'https://compas.pro/'
		}]
	});
	// <link rel="canonical" href="https://compas.pro/">
</script>
