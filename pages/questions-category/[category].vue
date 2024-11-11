<template>
	<TemplateQuestions />
</template>

<script setup>
	import TemplateQuestions from "@/components/Templates/Questions/Questions.vue";
	import { storeToRefs } from "pinia";
	import { useQuestionsStore } from "~/stores/questionsStore";

	const questionsStore = useQuestionsStore();
	const { questionsCategories } = storeToRefs(questionsStore);

	watch(
		() => route.params.category,
		async () => {
			await questionsStore.loadQuestions();
		},
		{ deep: true, immediate: true }
	);
	onUnmounted(async () => {
		await questionsStore.loadQuestions();
	});

	watchEffect(() => {
		const category = questionsCategories.value?.find((category) => category.slug == route.params.category);
		if (category) {
			useHead({
				title: category?.seo_title + " | Вопрос-ответ | Compas.pro",
				meta: [
					{
						name: "description",
						content: category?.seo_description,
					},
				],
			});
		}
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
