<template>
	<TemplateMain />
</template>

<script setup>
	import TemplateMain from "@/components/Templates/Main/Main.vue";

	// Мета теги
	useHead({
		title: "Проверка и оплата штрафов ГИБДД онлайн | Compas.pro",
		meta: [
			{
				name: "description",
				content:
					"Быстрая проверка и оплата штрафов ГИБДД онлайн. Удобный сервис для поиска и оплаты штрафов. Экономьте время и избегайте проблем с нашими безопасными и надежными онлайн-платежами.",
			},
		],
		link: [
			{
				rel: "canonical",
				href: "https://compas.pro/products/fines",
			},
		],
	});
</script>
