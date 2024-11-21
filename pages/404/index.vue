<template>
	<restrictedPage />
</template>

<script setup>
	import restrictedPage from "@/components/Templates/ErrorPage/404/404.vue";

	const config = useRuntimeConfig();
	const route = useRoute()
	const canonicalUrl = ref(null)
	
	onMounted(() => {
		// document.body.classList.add("error");
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

	
	onUnmounted(() => {
		// document.body.classList.remove("error");
	});
</script>
