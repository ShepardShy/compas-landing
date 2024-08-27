<template>
	<div class="articles-slider">
		<AppSlider
			:class="countSlides == 1 ? 'swiper-slider_only' : ''"
			:options="{ VisibleSlides: countSlides, spaceBetween: 20, pagination: { clickable: true, dynamicBullets: true } }"
		>
			<template #slide>
				<SwiperSlide
					v-for="{ id, imageMini, date, title, views } in slides"
					:key="id"
					:virtual-index="id"
				>
					<ArticleItem
						:id
						:image="imageMini"
						:title
						:views
						:date
					/>
				</SwiperSlide>
			</template>
		</AppSlider>
	</div>
</template>

<script setup>
	import { SwiperSlide } from "swiper/vue";
	import AppSlider from "@/components/AppSlider/Slider.vue";
	import ArticleItem from "@/components/Templates/Common/ArticleItem/ArticleItem.vue";

	import articles from "@/components/Templates/Articles/articles.js";

	let countSlides = ref(3);
	let slides = ref(articles);

	onMounted(() => {
		slides.value = articles;
		window.addEventListener("resize", checkingWindowWidth);
		checkingWindowWidth();
	});

	const checkingWindowWidth = () => {
		if (window.innerWidth >= 1240) {
			countSlides.value = 4;
		} else if (window.innerWidth <= 1240 && window.innerWidth >= 950) {
			countSlides.value = 3;
		} else if (window.innerWidth <= 950 && window.innerWidth >= 500) {
			countSlides.value = 2;
		} else {
			countSlides.value = 1;
		}
	};
</script>

<style scoped>
	@import url("./ArticlesSlider.scss");
</style>
