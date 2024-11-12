<template>
	<ClientOnly>
		<AuthPage />
	</ClientOnly>
</template>

<script setup>
	import "./Auth.scss";

	import AuthPage from "~/components/Templates/AuthPage/AuthPage.vue";

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

	// Мета теги
	useHead({
		title: "Авторизация | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});

	onMounted(() => {
		nextTick(() => {
			document.querySelector(".page").classList.add("page_auth");
		});
	});

	onUnmounted(() => {
		document.querySelector(".page").classList.remove("page_auth");
	});
</script>
