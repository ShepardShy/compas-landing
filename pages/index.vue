<template>
	<TemplateMain />
</template>

<script setup>
	import TemplateMain from "@/components/Templates/Main/Main.vue";

	// Мета теги

	useHead({
		title: "Отслеживание штрафов| Compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});
</script>
