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

	onMounted(() => {
		nextTick(() => {
			document.querySelector('.page').classList.add('page_auth')
		})
	})

	onUnmounted(() => {
		document.querySelector('.page').classList.remove('page_auth')
	})
</script>
