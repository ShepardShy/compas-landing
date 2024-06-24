<template>
	<AppSection class="ibg card">
		<div class="card__text">
			<p>Представленная тележка-дозатор обеспечивает высококачественную обработку любых территорий сыпучими противогололедными реагентами самых разных типов, включая такие тяжелые, как гранитная и мраморная крошка, песок и пескосоляные смеси. Тележка прекрасно подходит для использования во дворах</p>
			<p>Тележка прекрасно подходит для использования во дворах</p>
		</div>
		<BackgroundImg />
	</AppSection>
</template>

<script setup>
	import AppSection from "~/components/AppSection/AppSection.vue";
	import BackgroundImg from "./components/BackgroundImg.vue";
</script>

<style scoped lang="scss">
	@import url("./Card.scss");
</style>
