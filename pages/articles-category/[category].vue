<template>
	<TemplateArticles />
</template>

<script setup>
	import TemplateArticles from "@/components/Templates/Articles/Articles.vue";
	import { useArticlesStore } from "~/stores/articlesStore";
	import { storeToRefs } from "pinia";

	const articlesStore = useArticlesStore();
	const { page, perPage } = storeToRefs(articlesStore);
	const route = useRoute();

	watch(
		() => route.params.category,
		async () => {
			await useAsyncData("articles", async () => await articlesStore.loadArticles(route.params?.category));
		},
		{ immediate: true }
	);
	watch(
		() => [page.value, perPage.value],
		async () => {
			await articlesStore.loadArticles(route.params?.category);
		}
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
