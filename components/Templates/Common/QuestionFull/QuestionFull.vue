<template>
	<div class="question">
		<img
			v-if="image"
			:src="image"
			alt="image"
			class="question__image"
		/>
		<div class="question__body">
			<h2 class="question__title">{{ title }}</h2>
			<p
				v-html="answer"
				class="question__text"
			></p>
			<NuxtLink
				:href="`/questions/${questionId}`"
				v-if="isShowMore"
				class="question__more"
				>Подробнее</NuxtLink
			>
			<div class="question__info">
				<p class="question__date date">{{ dayjs(date).locale("ru").format("D MMMM YYYY") }}</p>
				<p class="question__views views">
					<IconPasswordEye class="header__views-eye" />
					<span>
						{{ views }}
					</span>
				</p>
				<div class="header__duration duration">Читать ворос-ответ: <span class="duration_black">2 мин</span></div>
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
		questionId: { type: String },
		date: { type: String },
		views: { type: Number },
		isShowMore: { type: Boolean, default: false },
	});
	const { image, answer, title, isShowMore, date, questionId, views } = toRefs(props);
</script>

<style scoped>
	@import url(./QuestionFull.scss);
</style>
