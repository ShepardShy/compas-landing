<template>
	<AuthPage />
</template>

<script setup>
	import AuthPage from "~/components/Templates/AuthPage/AuthPage.vue";

	// Мета теги
	useHead({
		title: "Авторизация . compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});
</script>
