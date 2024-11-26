<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />

	<AppH1 class="osago__title">Оформление ОСАГО</AppH1>
</template>

<script setup>
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";

	let breadcrumbs = computed(() => [
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Калькулятор ОСАГО",
			link: "/products/osago",
		},
		{
			title: "Оформление ОСАГО",
			link: "/osago/processing",
		},
	]);
</script>

<style lang="scss" scoped>
	@import url(./OsagoProcessing.scss);
</style>
