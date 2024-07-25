<template>
	<div class="questions-slider">
		<AppSlider
			:class="countSlides == 1 ? 'swiper-slider_only' : ''"
			:options="{ VisibleSlides: countSlides, spaceBetween: 20, pagination: { clickable: true, dynamicBullets: true } }"
		>
			<template #slide>
				<SwiperSlide
					v-for="slide in slides"
					:key="slide.id"
					:virtual-index="slide.id"
				>
					<QuestionItem
						:image="slide.image"
						:title="slide.title"
						:subtitle="slide.subtitle"
						:views="slide.views"
					/>
				</SwiperSlide>
			</template>
		</AppSlider>
	</div>
</template>

<script setup>
	import { SwiperSlide } from "swiper/vue";
	import AppSlider from "@/components/AppSlider/Slider.vue";
	import QuestionItem from "@/components/Templates/Common/QuestionItem/QuestionItem.vue";

	import questions from "./questions.json";

	let countSlides = ref(3);
	let slides = ref(questions);

	onMounted(() => {
		slides.value = questions;
		window.addEventListener("resize", checkingWindowWidth);
		checkingWindowWidth();
	});

	const checkingWindowWidth = () => {
		if (window.innerWidth > 1240) {
			countSlides.value = 4;
		} else if (window.innerWidth < 1240 && window.innerWidth > 950) {
			countSlides.value = 3;
		} else if (window.innerWidth < 950 && window.innerWidth > 640) {
			countSlides.value = 2;
		} else {
			countSlides.value = 1;
		}
	};
</script>

<style scoped>
	@import url("./QuestionsSlider.scss");
</style>
