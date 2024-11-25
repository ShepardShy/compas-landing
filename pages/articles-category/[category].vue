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

	const config = useRuntimeConfig();
	const canonicalUrl = ref(null);

	onMounted(() => {
		canonicalUrl.value = `${config.public.baseURL}${route.path.replace("/landing", "")}`;

		// Мета теги
		useHead({
			link: [
				{
					rel: "canonical",
					href: canonicalUrl.value,
				},
			],
		});
	});
</script>
