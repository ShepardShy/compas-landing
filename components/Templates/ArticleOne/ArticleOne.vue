<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<div
		v-if="articleDetail"
		class="article"
		ref="$articleWrapper"
	>
		<div class="article__left">
			<Header
				:title="name?.value"
				:image="detail_picture.value?.[0]?.file"
				:authorAvatar="author?.avatar"
				:authorName="author?.name"
				:authorDesc="author?.desc"
				:authorColor="author?.color"
				:date="created_at.value"
				:update="updated_at.value"
				:views="views?.value"
				:readingTime="reading_time.value"
			/>
			<!-- <ClientOnly> -->
			<div
				class="article__content"
				ref="$articleContent"
			>
				<template v-for="{ type, body, image, title, items, answer, id, views, questionId, date, readingTime } in detail_text.value">
					<component
						v-if="type == 'question'"
						:is="conmponentsMap?.[type]"
						:text="body"
						:title="questionById(questionId)?.name"
						:items
						:image="questionById(questionId)?.detail_picture?.[0]?.file"
						:answer="questionById(questionId)?.detail_text?.[0].body"
						:views="questionById(questionId)?.views"
						:id="questionById(questionId)?.slug"
						:date="questionById(questionId)?.created_at"
						:type
						:isShowMore="true"
					/>
					<component
						v-else
						:is="conmponentsMap?.[type]"
						:text="body"
						:type
						:title
						:isShowMore="true"
					/>
				</template>
			</div>
			<!-- </ClientOnly> -->
		</div>

		<div class="article__right">
			<Nav v-if="detail_text" />
		</div>
	</div>
	<Articles />
	<Social class="article__social" />
</template>

<script setup>
	import Articles from "~/components/Templates/Common/ArticlesBlock/ArticlesBlock.vue";
	import Social from "@/components/Templates/Common/Social/Social.vue";
	import Header from "./components/Header/Header.vue";
	// import article from "./article";
	import Nav from "./components/Nav/Nav.vue";
	import { useArticlesStore } from "~/stores/articlesStore";
	import { storeToRefs } from "pinia";

	// Компоненты конструктора
	import wrap from "~/components/Templates/Common/WrapText/WrapText.vue";
	import registration from "./components/Fines/Fines.vue";
	import interestItems from "./components/InterestItems/InterestItems.vue";
	import question from "~/components/Templates/Common/QuestionFull/QuestionFull.vue";

	const route = useRoute();

	const articlesStore = useArticlesStore();
	const { articlesList, articleDetail } = storeToRefs(articlesStore);

	const $articleWrapper = ref(null);
	const $articleContent = ref(null);
	provide("$articleWrapper", $articleWrapper);
	provide("$articleContent", $articleContent);

	await useAsyncData("articles", async () => (articlesList.value.length == 0 ? await articlesStore.loadArticles() : 0));
	await useAsyncData("article", async () => await articlesStore.loadArticle(route.params.id));

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

	let { created_at, user_id, questions, updated_at, detail_picture, name, views, detail_text, seo_description, seo_title, reading_time } = articleDetail.value;

	const questionById = (id) => questions?.data?.find((i) => i.id == id);

	const author = {
		name: user_id?.value?.localOptions?.[0]?.label?.text ?? "Темур Киселев",
		desc: "Эксперт компании Компас Дайнамикс",
		avatar: user_id?.value?.localOptions?.[0]?.label?.file ?? "",
		color: user_id?.value?.localOptions?.[0]?.label?.color ?? "",
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
			title: "Статьи",
			link: "/articles",
		},
		{
			title: name?.value,
			link: "/articles/za-chto-vypisan-shtraf",
		},
	];
	useHead({
		title: `${seo_title.value.value ? seo_title.value.value : seo_title.value} | Статьи | Compas.pro`,
		meta: [
			{
				name: "description",
				content: seo_description.value.value ? seo_description.value.value : seo_description.value,
			},
		],
	});
</script>

<style>
	@import url(./ArticleOne.scss);
</style>
