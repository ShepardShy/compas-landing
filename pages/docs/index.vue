<template>
	<DocsList />
</template>

<script setup>
	import DocsList from "@/components/Templates/Docs/List/List.vue";

	useHead({
		title: "Документы и Юридическая Информация сервиса Compas.pro | Compas.pro",
		meta: [
			{
				name: "description",
				content: "В разделе представлены публичная оферта, политика конфиденциальности и другие важные документы для пользователей проекта Compas.pro.",
			},
		],
	});
</script>
