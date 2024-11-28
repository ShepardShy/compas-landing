<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div class="articles">
		<div class="articles__left">
			<Search
				class="articles__search"
				@changeValue="changeValueSearch"
				placeholder="Поиск по базе знаний"
				:options="searchOptions"
			/>
			<AppNav
				v-if="articlesCategories"
				title="База знаний"
				:categories="articlesCategories"
				path="knowledge-category"
			/>
		</div>
		<div class="articles__right">
			<Title :title="currentTitle" />
			<ClientOnly>
				<List :articlesList />
			</ClientOnly>
		</div>
	</div>
</template>

<script setup>
	import Search from "./components/Search/Search.vue";
	import Title from "./components/Title/Title.vue";
	import List from "./components/List/List.vue";
	import { storeToRefs } from "pinia";
	import { useKnowledgeStore } from "~/stores/knowledgeStore";
	import AppNav from "~/components/AppNav/AppNav.vue";

	const route = useRoute();

	const articlesStore = useKnowledgeStore();

	const { categories, page, countPages, currentCategory, perPage, articlesCategories, currentTitle, articlesList, articles, currentCategoryId, options } = storeToRefs(articlesStore);

	page.value = route.query?.page ?? 1;
	perPage.value = route.query?.per_page ?? 12;

	console.log(!currentCategoryId.value && !route.fullPath.includes("category"), "currentCategoryId.value");
	!currentCategoryId.value && !route.fullPath.includes("category") ? await useAsyncData("knowledges", async () => await articlesStore.loadArticles(route.params?.category)) : 0;

	watch(
		() => [page.value, perPage.value],
		async () => {
			if (currentCategoryId.value || route.fullPath.includes("category")) return;
			await articlesStore.loadArticles(route.params?.category);
		}
	);

	// watch(
	// 	() => currentCategoryId.value,
	// 	async () => {
	// 		await articlesStore.loadArticles(route.params?.category);
	// 	}
	// );

	const searchOptions = ref([]);
	const changeValueSearch = async (search) => {
		if (search.value) {
			await navigateTo(`/knowledge/${search.value}`);
			return;
		}

		searchOptions.value = await articlesStore.searchOptions(search);
		searchOptions.value = searchOptions.value.map((i) => {
			return { ...i, value: i.label.slug };
		});
	};

	const category = computed(() => articlesCategories.value?.find((category) => category.slug == route.params.category));

	// onMounted(async () => {
	// 	await useAsyncData("knowledges", async () => await articlesStore.loadArticles(route.params?.category));
	// });

	watch(
		() => category.value,
		() => {
			if (category.value) {
				useHead({
					title: category.value?.seo_title + " | База знаний | Compas.pro",
					meta: [
						{
							name: "description",
							content: category.value?.seo_description,
						},
					],
				});
				return;
			}
			// Мета теги
			useHead({
				title: "Полезные статьи об эффективном управлении автопарком | Compas.pro",
				meta: [
					{
						name: "description",
						content:
							"Читайте наш блог на Compas.pro — здесь собраны полезные статьи и советы для эффективного управления автопарком. Как контролировать водителей и автомобили и экономить на управлении.",
					},
				],
			});
		},
		{ immediate: true, deep: true }
	);

	let breadcrumbs = [
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "База знаний",
			link: "/knowledge",
		},
		category.value
			? {
					title: category.value?.title,
					link: `/knowledge-category/${category.value?.slug}`,
			  }
			: null,
	];
</script>

<style scoped>
	@import url("./Knowledge.scss");
</style>
