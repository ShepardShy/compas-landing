<template><GuidesOne /></template>

<script setup>
	import GuidesOne from "@/components/Templates/GuidesOne/GuidesOne.vue";

	const route = useRoute();

	// Мета теги
	useHead({
		// title: "Вопросы ответы | Compas.pro",
		// meta: [
		// 	{
		// 		name: "description",
		// 		content: "Описание.",
		// 	},
		// ],
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/guides/${route.params.id}`,
			},
		],
	});
</script>
