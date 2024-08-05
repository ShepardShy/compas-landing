<template>
	<div
		class="article"
		ref="$articleWrapper"
	>
		<div class="article__left">
			<Header
				:title
				:image
				:authorAvatar="author.avatar"
				:authorName="author.name"
				:authorDesc="author.desc"
				:date
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
					:questionId
					:date
					:isShowMore="true"
					v-for="{ type, body, image, title, items, answer, views, questionId, date } in content"
				/>
			</div>
		</div>

		<div class="article__right">
			<Nav />
		</div>
	</div>
	<Articles />
	<Social class="article__social" />
</template>

<script setup>
	import Articles from "~/components/Templates/Common/ArticlesBlock/ArticlesBlock.vue";
	import Social from "@/components/Templates/Common/Social/Social.vue";
	import Header from "./components/Header/Header.vue";
	import article from "./article.json";
	import Nav from "./components/Nav/Nav.vue";

	// Компоненты конструктора
	import wrap from "~/components/Templates/Common/WrapText/WrapText.vue";
	import registration from "./components/Fines/Fines.vue";
	import interestItems from "./components/InterestItems/InterestItems.vue";
	import question from "~/components/Templates/Common/QuestionFull/QuestionFull.vue";

	const $articleWrapper = ref(null);
	const $articleContent = ref(null);
	provide("$articleWrapper", $articleWrapper);
	provide("$articleContent", $articleContent);

	const conmponentsMap = {
		wrap,
		registration,
		interestItems,
		question,
	};
	const { author, date, image, title, views, content } = article;
</script>

<style>
	@import url(./ArticleOne.scss);
</style>
