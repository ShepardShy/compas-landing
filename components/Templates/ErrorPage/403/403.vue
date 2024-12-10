<template>
	<figure class="ibg error__img">
		<img
			:src="page403"
			alt="Доступ к странице ограничен"
		/>
	</figure>

	<AppH1 class="error__title"> Доступ к странице ограничен, ошибка 403 </AppH1>

	<NuxtLink
		to="/"
		class="error__link"
	>
		Главная страница
	</NuxtLink>
</template>

<script setup>
	import "@/error.scss";
	import "@/assets/default.scss";
	import "@/assets/fonts/fonts.css";
	import "@/assets/global.scss";
	import "./403.scss";
	import page403 from "/images/pages/error/403.svg";

	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
</script>

<style>
	@import url(./403.scss);
</style>
