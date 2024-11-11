<template>
	<TemplateContacts />
</template>

<script setup>
	import TemplateContacts from "@/components/Templates/Contacts/Contacts.vue";

	// Мета теги
	useHead({
		title: "Контакты — Свяжитесь с нами для получения поддержки и информации | Compas.pro",
		meta: [
			{
				name: "description",
				content:
					"Нужна помощь или дополнительная информация? Свяжитесь с нами через удобные каналы — телефон, email или форму обратной связи. Мы всегда рады помочь вам с любыми вопросами, связанными с нашими услугами и продуктами.",
			},
		]
	});

	
	const config = useRuntimeConfig();
	const route = useRoute()
	const canonicalUrl = ref(null)
	
	onMounted(() => {
		canonicalUrl.value = `${config.public.baseURL}${route.path.replace('/landing', '')}`;

		// Мета теги
		useHead({
			link: [
				{
					rel: 'canonical',
					href: canonicalUrl.value,
				},
			],
		});
	})
</script>
