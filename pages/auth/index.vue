<template>
	<AuthPage />
</template>

<script setup>
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
</script>
