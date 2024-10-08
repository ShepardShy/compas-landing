<template>
	<div class="questions-slider">
		<AppSlider
			v-if="questionsList"
			:class="countSlides == 1 ? 'swiper-slider_only' : ''"
			:options="{ VisibleSlides: countSlides, centeredSlidesBounds: true, spaceBetween: 20, pagination: { clickable: true, dynamicBullets: true } }"
		>
			<template #slide>
				<template v-for="{ created_at, slug, detail_picture, detail_text, name, views } in questionsList">
					<SwiperSlide
						v-if="detail_text"
						:key="id"
						:virtual-index="id"
					>
						<QuestionItem
							:image="detail_picture?.[0]?.file"
							:title="name"
							:answer="detail_text?.[0]?.body"
							:views
							:date="created_at"
							:id="slug.value"
						/>
					</SwiperSlide>
				</template>
			</template>
		</AppSlider>
	</div>
</template>

<script setup>
	import "./QuestionsSlider.scss";
	import { SwiperSlide } from "swiper/vue";
	import AppSlider from "@/components/AppSlider/Slider.vue";
	import QuestionItem from "@/components/Templates/Common/QuestionItem/QuestionItem.vue";

	import questions from "@/components/Templates/Questions/questions.json";

	import { storeToRefs } from "pinia";
	import { useQuestionsStore } from "~/stores/questionsStore";

	const route = useRoute();

	const questionsStore = useQuestionsStore();
	const { categories, questionsList, questionDetail } = storeToRefs(questionsStore);

	!questionsList.value.length ? await questionsStore.loadQuestions() : 0;

	console.log(questionsList.value);

	let countSlides = ref(3);

	onMounted(() => {
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