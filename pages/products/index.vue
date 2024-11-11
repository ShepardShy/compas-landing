<template>
	<AppH1> Продукты </AppH1>
</template>

<script setup>
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";

	
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

<style lang="scss" scoped></style>
