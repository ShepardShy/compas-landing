<template>
	<TemplateArticles />
</template>

<script setup>
	import TemplateArticles from "@/components/Templates/Articles/Articles.vue";

	// Мета теги
	useHead({
		title: "Полезные статьи об эффективном управлении автопарком | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Читайте наш блог на Compas.pro — здесь собраны полезные статьи и советы для эффективного управления автопарком. Как контролировать водителей и автомобили и экономить на управлении.",
			},
		],
	});
</script>
