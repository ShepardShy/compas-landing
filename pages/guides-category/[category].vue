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
			await guidesStore.loadGuides(route.params.category);
		},
		{ deep: true }
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
