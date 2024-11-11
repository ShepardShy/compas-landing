<template><TemplateKnowledge /></template>

<script setup>
	import TemplateKnowledge from "@/components/Templates/Knowledge/Knowledge.vue";
	import { useKnowledgeStore } from "~/stores/knowledgeStore";

	const knowledgeStore = useKnowledgeStore();

	watch(
		() => route.params.category,
		async () => {
			await knowledgeStore.loadArticles();
		},
		{ deep: true, immediate: true }
	);
	onUnmounted(async () => {
		await knowledgeStore.loadArticles();
	});

	const config = useRuntimeConfig();
	const route = useRoute()
	const canonicalUrl = ref(null)
	
	onMounted(() => {
		canonicalUrl.value = `${config.public.baseURL}${route.path.replace('/landing', '')}`;

		// Мета теги
		useHead({
			link: [
				{
					rel: 'canonical',
					href: canonicalUrl.value,
				},
			],
		});
	})
</script>
