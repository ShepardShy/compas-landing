<template>
	<Distance />
</template>

<script setup>
	import Distance from "~/components/Templates/Distance/Distance.vue";

	// Мета теги
	useHead({
		title: "Расчёт расстояния . Компас",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});
</script>
