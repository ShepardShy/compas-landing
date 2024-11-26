<template>
	<Template />
</template>

<script setup>
	import Template from "@/components/Templates/Osago/Main.vue";

	// Мета теги
	useHead({
		title: "Заголовок",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});

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
