<template>
	<NuxtLink
		:to="`/questions/${id}`"
		class="question__item"
	>
		<div class="question__top">
			<figure class="ibg question__icon">
				<img
					:src="image ? image : defaultImgQuestion"
					:alt="title"
				/>
			</figure>
		</div>
		<div class="question__body">
			<div class="question__title">
				{{ title }}
			</div>
			<div
				v-html="answer"
				class="question__subtitle"
			></div>
			<!-- <div class="question__info"> -->
			<div class="question__views views">
				<IconPasswordEye />
				<span>
					{{ views }}
				</span>
			</div>
			<!-- </div> -->
		</div>
	</NuxtLink>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import defaultImgQuestion from "/images/main/questions/question.jpg";

	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		answer: {
			type: String,
		},
		image: {
			type: String,
		},
		views: {
			type: Number,
			default: 0,
		},
		date: {
			type: String,
		},
		id: {
			type: String,
		},
	});
	const { title, views, image, answer, id } = toRefs(props);
</script>

<style lang="scss" scoped>
	@import url("./QuestionItem.scss");
</style>
