<template>
	<div class="questions-slider">
		<AppSlider
			:class="countSlides == 1 ? 'swiper-slider_only' : ''"
			:options="{ VisibleSlides: countSlides, spaceBetween: 0, pagination: { clickable: true, dynamicBullets: true } }"
		>
			<template #slide>
				<SwiperSlide
					v-for="slide in slides"
					:key="slide.id"
					:virtual-index="slide.id"
				>
					<div class="questions-slider__item">
						<div class="questions-slider__top">
							<figure class="ibg questions-slider__icon">
								<img
									:src="slide.image ? slide.image : '/main/questions/question.jpg'"
									:alt="slide.title"
								/>
							</figure>
						</div>
						<div class="questions-slider__body">
							<div class="questions-slider__title">
								{{ slide.title }}
							</div>
							<div class="questions-slider__subtitle">
								{{ slide.subtitle }}
							</div>
							<div class="questions-slder__views">
								<IconPasswordEye />
								<span>
									{{ slide.views }}
								</span>
							</div>
						</div>
					</div>
				</SwiperSlide>
			</template>
		</AppSlider>
	</div>
</template>

<script setup>
	import { SwiperSlide } from "swiper/vue";
	import AppSlider from "@/components/AppSlider/Slider.vue";
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";

	import questions from "./questions.json";

	let countSlides = ref(3);
	let slides = ref(questions);

	const setPrice = item => {
		return item.prices[0].price;
	};

	const setDayPrice = item => {
		return item.day_prices[0].price;
	};

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
