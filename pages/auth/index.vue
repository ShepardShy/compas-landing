<template>
	<AuthPage />
</template>

<script setup>
	import './Auth.scss'

	import AuthPage from "~/components/Templates/AuthPage/AuthPage.vue";

	// Мета теги
	useHead({
		title: "Авторизация | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/auth`,
			},
		],
	});

	const config = useRuntimeConfig();
	const route = useRoute()
	const canonicalUrl = ref(null)
	
	onMounted(() => {
		nextTick(() => {
			document.querySelector('.page').classList.add('page_auth')
		})

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
		document.querySelector('.page').classList.remove('page_auth')
	})
</script>
