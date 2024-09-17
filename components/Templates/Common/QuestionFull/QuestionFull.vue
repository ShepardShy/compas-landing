<template>
	<div class="question">
		<img
			v-if="image"
			:src="image"
			alt="image"
			class="question__image"
		/>
		<div class="question__body">
			<h1 class="question__title">{{ title }}</h1>
			<p
				v-html="answer"
				class="question__text"
			></p>
			<NuxtLink
				:href="`/questions/${id}`"
				v-if="isShowMore"
				class="question__more"
				>Подробнее</NuxtLink
			>
			<div class="question__info">
				<p class="question__views views">
					<IconPasswordEye class="header__views-eye" />
					<span>
						{{ views ? views : 0 }}
					</span>
				</p>
				<div class="header__duration duration">
					Читать вопрос-ответ: <span class="duration_black">{{ readingTime }} мин</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import "dayjs/locale/ru";
	const dayjs = useDayjs();

	const props = defineProps({
		title: { type: String },
		answer: { type: String },
		image: { type: String },
		id: { type: String },
		date: { type: String },
		views: { type: Number },
		isShowMore: { type: Boolean, default: false },
		readingTime: { type: Number },
	});
	const { image, answer, title, isShowMore, date, id, views, readingTime } = toRefs(props);
</script>

<style>
	@import url(./QuestionFull.scss);
</style>
