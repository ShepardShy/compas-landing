<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div
		v-if="guideDetail"
		class="guide"
		ref="$guideWrapper"
	>
		<div
			ref="$guideContent"
			class="guide__left"
		>
			<AppH1 class="guide__left-title video-guide">{{ guideDetail.name?.value }}</AppH1>
			<Header
				:title="guideDetail.name?.value"
				:image="guideDetail.detail_picture?.value?.[0]?.file"
				:authorAvatar="author?.avatar"
				:authorName="author?.name"
				:authorDesc="author?.desc"
				:authorColor="author?.color"
				:date="guideDetail.created_at?.value"
				:update="guideDetail.updated_at?.value"
				:views="guideDetail.views?.value"
				:video="guideDetail.video?.value"
				:readingTime="guideDetail.reading_time?.value"
			/>
			<div class="guide__content">
				<component
					:is="conmponentsMap?.[type]"
					:text="body"
					:title
					:items
					:image
					:answer
					:views
					:id
					:date
					:type
					:isShowMore="true"
					v-for="{ type, body, image, title, items, answer, views, id, date } in guideDetail.detail_text?.value"
				/>
			</div>
		</div>

		<div class="guide__right">
			<Nav v-if="guideDetail?.detail_text" />
		</div>
	</div>
	<!-- <Articles /> -->
	<Social class="guide__social" />
</template>

<script setup>
	import Articles from "~/components/Templates/Common/ArticlesBlock/ArticlesBlock.vue";
	import Social from "@/components/Templates/Common/Social/Social.vue";
	import Header from "./components/Header/Header.vue";
	// import article from "./article";
	import Nav from "./components/Nav/Nav.vue";
	import { useGuidesStore } from "~/stores/guidesStore";
	import { storeToRefs } from "pinia";
	import AppH1 from "~/components/AppHeaders/H1/H1.vue";

	// Компоненты конструктора
	import wrap from "~/components/Templates/Common/WrapText/WrapText.vue";
	import registration from "./components/Fines/Fines.vue";
	import interestItems from "./components/InterestItems/InterestItems.vue";
	import question from "~/components/Templates/Common/QuestionFull/QuestionFull.vue";

	const route = useRoute();

	const guidesStore = useGuidesStore();
	const { guidesList, guideDetail } = storeToRefs(guidesStore);

	const $guideWrapper = ref(null);
	const $guideContent = ref(null);
	provide("$guideWrapper", $guideWrapper);
	provide("$guideContent", $guideContent);

	await useLazyAsyncData("guide", async () => await guidesStore.loadGuide(route.params.id));

	// const article = computed(() => articleDetail.value);
	// console.log(article.value);

	const conmponentsMap = {
		wrap,
		registration,
		"check-sts": registration,
		"check-vu": registration,
		"check-num_post": registration,
		"check-gos": registration,
		"check-inn": registration,
		interestItems,
		question,
	};

	console.log(guideDetail.value, "guideDetail.value");

	const author = {
		name: guideDetail.value?.user_id?.value?.localOptions?.[0]?.label?.text ?? "Темур Киселев",
		desc: "Эксперт компании Компас Дайнамикс",
		avatar: guideDetail.value?.user_id?.value?.localOptions?.[0]?.label?.file ?? "",
		color: guideDetail.value?.user_id?.value?.localOptions?.[0]?.label?.color ?? "",
	};

	// if (route.params?.id) {
	// 	const item = articlesList.value?.find(i => i?.slug?.value == route.params?.id);
	// 	if (!item) {
	// 		await navigateTo("/404");
	// 	}
	// }
	// watchEffect(async () => {
	// 	if (route.params?.id) {
	// 		const item = articlesList.value?.find(i => i?.slug?.value == route.params?.id);
	// 		if (!item) {
	// 			await navigateTo("/404");
	// 		}
	// 	}
	// });

	let breadcrumbs = [
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Гайды",
			link: "/guides",
		},
		{
			title: guideDetail.value?.name?.value,
			link: "/guides/za-chto-vypisan-shtraf",
		},
	];
	useHead({
		title: `${guideDetail.value?.seo_title?.value?.value ? guideDetail.value?.seo_title?.value.value : guideDetail.value?.seo_title?.value} | Гайды | Compas.pro`,
		meta: [
			{
				name: "description",
				content: guideDetail.value?.seo_description.value.value ? guideDetail.value?.seo_description.value.value : guideDetail.value?.seo_description.value,
			},
		],
	});
</script>

<style>
	@import url(./GuidesOne.scss);
</style>
