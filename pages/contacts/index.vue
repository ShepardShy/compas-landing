<template>
	<TemplateContacts />
</template>

<script setup>
	import TemplateContacts from "@/components/Templates/Contacts/Contacts.vue";

	// Мета теги
	useHead({
		title: "Контакты | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
	});
</script>
