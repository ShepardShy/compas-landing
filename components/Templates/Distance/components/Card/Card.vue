<template>
	<AppSection class="ibg card">
		<div class="card__text">
			<p>{{ textMap?.[route.params?.tab] }}</p>
		</div>
		<BackgroundImg />
	</AppSection>
</template>

<script setup>
	import AppSection from "~/components/AppSection/AppSection.vue";
	import BackgroundImg from "./components/BackgroundImg.vue";

	const route = useRoute();

	const textMap = {
		mkad: "Хотите быстро узнать, сколько километров отделяет ваш пункт назначения от МКАД? Просто выберите точку на карте или введите адрес в поисковую строку, и нажмите «Рассчитать». Получите точное расстояние и удобный маршрут всего за пару кликов.",
		kad: "Хотите быстро узнать, сколько километров отделяет ваш пункт назначения от КАД? Просто выберите точку на карте или введите адрес в поисковую строку, и нажмите «Рассчитать». Получите точное расстояние и удобный маршрут всего за пару кликов.",
	};
</script>

<style scoped lang="scss">
	@import url("./Card.scss");
</style>
