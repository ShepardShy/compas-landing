<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div class="guides">
		<div class="guides__left">
			<Search
				class="guides__search"
				@changeValue="changeValueSearch"
				placeholder="Поиск по гайдам"
				:options="searchOptions"
			/>
			<AppNav
				v-if="guidesCategories"
				title="Гайды"
				:categories="guidesCategories"
				path="guides-category"
			/>
		</div>
		<div class="guides__right">
			<Title :title="currentTitle" />
			<ClientOnly>
				<List :list="guidesList" />
			</ClientOnly>
		</div>
	</div>
</template>

<script setup>
	import Search from "./components/Search/Search.vue";
	import Title from "./components/Title/Title.vue";
	import List from "./components/List/List.vue";
	import { storeToRefs } from "pinia";
	import { useGuidesStore } from "~/stores/guidesStore";
	import { useGlobalStore } from "~/stores/globalStore";
	import AppNav from "~/components/AppNav/AppNav.vue";

	const route = useRoute();

	const guidesStore = useGuidesStore();
	const globalStore = useGlobalStore();

	// console.log(globalStore.lastModified, "globalStore.lastModified");
	// await useAsyncData("lastModified", async () => (!globalStore.lastModified ? await globalStore.loadLastModified() : 0));

	const { page, perPage, guidesCategories, currentTitle, guidesList } = storeToRefs(guidesStore);

	page.value = route.query.page ?? 1;
	perPage.value = route.query.per_page ?? 12;
	await useAsyncData("guides", async () => await guidesStore.loadGuides(route.params.category));

	watch(
		() => [page.value, perPage.value],
		async () => {
			await guidesStore.loadGuides(route.params.category);
		}
	);

	// watch(
	// 	() => currentCategoryId.value,
	// 	async () => {
	// 		await guidesStore.loadGuides();
	// 	}
	// );

	const searchOptions = ref([]);
	const changeValueSearch = async (search) => {
		if (search.value) {
			await navigateTo(`/guides/${search.value}`);
			return;
		}

		searchOptions.value = await guidesStore.searchOptions(search);
		searchOptions.value = searchOptions.value.map((i) => {
			return { ...i, value: i.label.slug };
		});
	};

	const category = computed(() => guidesCategories.value?.find((category) => category.slug == route.params.category));

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
				title: "Гайды и инструкции по использованию сервиса Compas.pro | Compas.pro",
				meta: [
					{
						name: "description",
						content: "Как правильно пользоваться сервисом Compas.pro. Узнайте, как проверить штрафы, оформить страховку и решить другие важные задачи, связанные с управлением автопарка.",
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
	@import url("./Guides.scss");
</style>
