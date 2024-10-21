<template>
	<TemplateTariffs />
</template>

<script setup>
	import TemplateTariffs from "@/components/Templates/Tariffs/Tariffs.vue";

	// Мета теги
	useHead({
		title: "Тарифы на услуги отслеживания штрафов и управления автопарком | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Сравните тарифы на услуги отслеживания штрафов, управления автопарком и сотрудниками. Узнайте, какой план подходит именно вам — от бесплатного до профессионального тарифа с минимальной комиссией за оплату штрафов.",
			},
		],
		link:[{
			rel:'canonical',
			href:'https://compas.pro/tariffs'
		}]
	});
</script>
