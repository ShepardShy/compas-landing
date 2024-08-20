<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div
		ref="personalDocWrapperRef"
		class="personal-docs"
	>
		<div class="personal-docs__left">
			<div
				class="personal-docs__header"
				v-if="activeDoc != null"
			>
				<div class="personal-docs__text">г. {{ activeDoc.city }}</div>
				<div class="personal-docs__text">Дата размещения: {{ setDate }}</div>
			</div>
			<div
				class="approved"
				v-html="activeDoc?.approved"
			></div>
			<div
				v-if="activeDoc?.h1"
				v-html="activeDoc?.h1"
				class="personal-docs__title"
				id="#h1"
			></div>
			<article
				class="personal-docs__content"
				v-html="activeDoc ? activeDoc.content : null"
				ref="personalDocRef"
			></article>
		</div>
		<DocsNav v-if="activeDoc != null" />
	</div>
</template>

<script setup>
	import "./Content.scss";

	import docs from "../docs.json";
	import DocsNav from "./Nav/Nav.vue";
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
	import AppBreadcrambs from "@/components/AppBreadcrambs/Breadcrambs.vue";

	const activeDoc = ref(null);
	const route = useRoute();
	const personalDocRef = ref(null);
	const personalDocWrapperRef = ref(null);

	provide("personalDocRef", personalDocRef);
	provide("personalDocWrapperRef", personalDocWrapperRef);

	onMounted(() => {
		activeDoc.value = docs.find(p => p.url == route.params.doc);
		breadcrumbs.value.push({
			title: activeDoc.value.title,
			link: activeDoc.value.url,
		});
	});

	watchEffect(() => {
		if (activeDoc.value) {
			useHead({
				title: activeDoc.value.meta.title + " | Compas.pro",
				meta: [
					{
						name: "description",
						content: activeDoc.value.meta.description,
					},
				],
			});
			return;
		}
		useHead({
			title: "Документы и Юридическая Информация сервиса Compas.pro | Compas.pro",
			meta: [
				{
					name: "description",
					content: "В разделе представлены публичная оферта, политика конфиденциальности и другие важные документы для пользователей проекта Compas.pro.",
				},
			],
		});
	});

	let breadcrumbs = ref([
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Документы",
			link: `/docs`,
		},
	]);

	const setDate = computed(() => {
		return new Date(activeDoc.value.date).toLocaleDateString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" });
	});
</script>
