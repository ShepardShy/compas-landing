<template>
	<AuthPage />
</template>

<script setup>
	import './Auth.scss'

	import AuthPage from "~/components/Templates/AuthPage/AuthPage.vue";

	const route = useRoute();

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
				href: `https://compas.pro/auth/${route.params.tab}`,
			},
		],
	});

	onMounted(() => {
		nextTick(() => {
			document.querySelector('.page').classList.add('page_auth')
		})
	})

	onUnmounted(() => {
		document.querySelector('.page').classList.remove('page_auth')
	})
</script>
