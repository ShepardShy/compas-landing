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
			await useAsyncData("articles", async () => await articlesStore.loadArticles());
		},
		{ deep: true, immediate: true }
	);
	// onUnmounted(async () => {
	// 	console.log("onUnmounted");
	// 	await articlesStore.loadArticles();
	// });

	// Мета теги
	useHead({
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/articles-category/${route.params.category}`,
			},
		],
	});
</script>
