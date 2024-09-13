<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />

	<div
		class="article"
		ref="$articleWrapper"
	>
		<div class="article__left">
			<Header
				:title="preview_text"
				:image="detail_picture[0].file"
				:authorAvatar="author?.avatar"
				:authorName="author?.name"
				:authorDesc="author?.desc"
				:date="created_at"
				:views
			/>
			<div
				class="article__content"
				ref="$articleContent"
			>
				<component
					:is="conmponentsMap[type]"
					:text="body"
					:title
					:items
					:image
					:answer
					:views
					:id
					:date
					:isShowMore="true"
					v-for="{ type, body, image, title, items, answer, views, id, date } in detail_text"
				/>
			</div>
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
	import articles from "../Articles/articles.js";
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
	const { categories, currentTitle, articlesList } = storeToRefs(articlesStore);

	const $articleWrapper = ref(null);
	const $articleContent = ref(null);
	provide("$articleWrapper", $articleWrapper);
	provide("$articleContent", $articleContent);

	articlesList.value.length == 0 ? await articlesStore.loadArticles() : 0;

	const article = computed(() => articlesList.value.find(i => i.slug.value == route.params.id));
	console.log(article.value);

	const conmponentsMap = {
		wrap,
		registration,
		interestItems,
		question,
	};
	let { created_at, detail_picture, preview_text, views, detail_text, seo_description, seo_title } = article.value;

	const author = {
		name: "Темур Киселев",
		desc: "Эксперт компании Компас Дайнамикс",
		avatar: "",
	};

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
			title: preview_text,
			link: "/articles/za-chto-vypisan-shtraf",
		},
	];
	useHead({
		title: seo_title.value,
		meta: [
			{
				name: "description",
				content: seo_description.value,
			},
		],
	});
</script>

<style>
	@import url(./ArticleOne.scss);
</style>
