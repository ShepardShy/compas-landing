<template>
	<TemplateContacts />
</template>

<script setup>
	import TemplateContacts from "@/components/Templates/Contacts/Contacts.vue";

	// Мета теги
	useHead({
		title: "Контакты . compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});
</script>
