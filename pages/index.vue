<template>
	<TemplateMain />
</template>

<script setup>
	import TemplateMain from "@/components/Templates/MainPage/Main.vue";

	// Мета теги

	useHead({
		title: "Главная | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});
</script>
