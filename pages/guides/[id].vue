<template>
	<GuidesOne />
</template>

<script setup>
	import GuidesOne from "@/components/Templates/GuidesOne/GuidesOne.vue";

	const config = useRuntimeConfig();
	const route = useRoute();
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
