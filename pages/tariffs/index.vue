<template>
	<TemplateTariffs />
</template>

<script setup>
	import TemplateTariffs from "@/components/Templates/Tariffs/Tariffs.vue";

	// Мета теги
	useHead({
		title: "Тарифы . compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});
</script>
