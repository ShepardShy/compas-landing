<template>
	<div class="article">
		<div class="article__wrapper">
			<Header
				:title
				:image
				:authorAvatar="author.avatar"
				:authorName="author.name"
				:authorDesc="author.desc"
				:date
				:views
			/>
		</div>
		<Nav />
	</div>
</template>

<script setup>
	import Header from "./components/Header/Header.vue";
	import article from "./article.json";
	import Nav from "./components/Nav/Nav.vue";
	const { author, date, image, title, views } = article;
</script>

<style>
	@import url(./ArticleOne.scss);
</style>
