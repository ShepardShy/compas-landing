<template>
	<TemplateGuides />
</template>

<script setup>
	import TemplateGuides from "@/components/Templates/Guides/Guides.vue";
	import { useGuidesStore } from "~/stores/guidesStore";

	const guidesStore = useGuidesStore();

	const route = useRoute();

	watch(
		() => route.params.category,
		async () => {
			await guidesStore.loadGuides();
		},
		{ deep: true, immediate: true }
	);
	onUnmounted(async () => {
		await guidesStore.loadGuides();
	});

	// Мета теги
	useHead({
		// title: "Блог Compas.pro: Полезные статьи о штрафах, ПДД и правах водителей | Compas.pro",
		// meta: [
		// 	{
		// 		name: "description",
		// 		content:
		// 			"Читайте наш блог на Compas.pro — здесь собраны полезные статьи и советы для водителей о штрафах, правилах дорожного движения и защите своих прав. Узнайте, как проверить штрафы ГИБДД, избежать и оспорить их.",
		// 	},
		// ],
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/guides-category/${route.params.category}`,
			},
		],
	});
</script>
