<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div class="articles">
		<div class="articles__left">
			<Search
				class="articles__search"
				@changeValue="changeValueSearch"
				placeholder="Поиск по статьям"
				:options="searchOptions"
			/>
			<AppNav
				v-if="articlesCategories"
				title="Статьи"
				:categories="articlesCategories"
				path="articles-category"
			/>
		</div>
		<div class="articles__right">
			<Title :title="currentTitle" />
			<ArticlesList :articlesList />
		</div>
	</div>
</template>

<script setup>
	import Search from "./components/Search/Search.vue";
	import Title from "./components/Title/Title.vue";
	import ArticlesList from "./components/ArticlesList/ArticlesList.vue";
	import { storeToRefs } from "pinia";
	import { useArticlesStore } from "~/stores/articlesStore";
	import AppNav from "~/components/AppNav/AppNav.vue";

	const route = useRoute();

	const articlesStore = useArticlesStore();

	const { categories, page, countPages, currentCategory, perPage, articlesCategories, currentTitle, articlesList, articles, currentCategoryId, options } = storeToRefs(articlesStore);

	page.value = 1;
	perPage.value = 12;
	await useAsyncData("articles", async () => await articlesStore.loadArticles());

	watch(
		() => [page.value, perPage.value],
		async () => {
			await articlesStore.loadArticles();
		}
	);

	watch(
		() => currentCategoryId.value,
		async () => {
			await articlesStore.loadArticles();
		}
	);

	const searchOptions = ref([]);
	const changeValueSearch = async (search) => {
		if (search.value) {
			await navigateTo(`/articles/${search.value}`);
			return;
		}

		searchOptions.value = await articlesStore.searchOptions(search);
		searchOptions.value = searchOptions.value.map((i) => {
			return { ...i, value: i.label.slug };
		});
	};

	const category = computed(() => articlesCategories.value.find((category) => category.slug == route.params.category));

	watch(
		() => category.value,
		() => {
			if (category.value) {
				useHead({
					title: category.value?.seo_title + " | Гайды | Compas.pro",
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
			title: "Гайды",
			link: "/guides",
		},
		category.value
			? {
					title: category.value?.title,
					link: `/questions-category/${category.value?.slug}`,
			  }
			: null,
	];
</script>

<style scoped>
	@import url("./Articles.scss");
</style>
