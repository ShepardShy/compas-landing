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
	});
</script>
