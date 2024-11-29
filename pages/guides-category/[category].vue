<template>
	<TemplateGuides />
</template>

<script setup>
	import TemplateGuides from "@/components/Templates/Guides/Guides.vue";
	import { useGuidesStore } from "~/stores/guidesStore";
	import { storeToRefs } from "pinia";

	const guidesStore = useGuidesStore();
	const { page, perPage } = storeToRefs(guidesStore);
	const route = useRoute();

	watch(
		() => route.params.category,
		async () => {
			await guidesStore.loadGuides(route.params.category);
		},
		{ immediate: true }
	);
	watch(
		() => [page.value, perPage.value],
		async () => {
			await guidesStore.loadGuides(route.params?.category);
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
