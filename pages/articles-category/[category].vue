<template>
	<TemplateArticles />
</template>

<script setup>
	import TemplateArticles from "@/components/Templates/Articles/Articles.vue";
	import { useArticlesStore } from "~/stores/articlesStore";

	const articlesStore = useArticlesStore();

	const route = useRoute();

	watch(
		() => route.params.category,
		async () => {
			articlesStore.loadArticles();
		},
		{ deep: true, immediate: true }
	);
	onUnmounted(() => {
		articlesStore.loadArticles();
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
				href: `https://compas.pro/articles-category/${route.params.category}`,
			},
		],
	});
</script>
