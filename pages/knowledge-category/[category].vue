<template><TemplateKnowledge /></template>

<script setup>
	import TemplateKnowledge from "@/components/Templates/Knowledge/Knowledge.vue";
	import { useKnowledgeStore } from "~/stores/knowledgeStore";
	import { storeToRefs } from "pinia";

	const knowledgeStore = useKnowledgeStore();
	const { page, perPage } = storeToRefs(knowledgeStore);
	const route = useRoute();

	watch(
		() => route.params.category,
		async () => {
			await knowledgeStore.loadArticles(route.params?.category);
			console.log("route.params.category");
		},
		{ immediate: true }
	);
	watch(
		() => [page.value, perPage.value],
		async () => {
			await knowledgeStore.loadArticles(route.params?.category);
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
