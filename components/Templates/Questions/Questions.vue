<template>
	<div class="questions">
		<div class="questions__left">
			<Search />
			<Nav />
			<AskQuestion />
		</div>
		<div class="questions__right">
			<Title />
		</div>
	</div>
</template>

<script setup lang="ts">
	import Search from "./components/Search/Search.vue";
	import Title from "./components/Title/Title.vue";
	import AskQuestion from "./components/AskQuestion/AskQuestion.vue";
	import Nav from "./components/Nav/Nav.vue";
</script>

<style scoped>
	@import url("./Questions.scss");
</style>
