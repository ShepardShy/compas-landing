<template><Payment /></template>

<script setup>
	import Payment from "~/components/Templates/Payment/Payment.vue";

	// Мета теги
	useHead({
		title: "Ваш платеж в обработке",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
			{
				name: "robots",
				content: "noindex, nofollow",
			},
		],
	});
</script>

<style lang="scss" scoped></style>
