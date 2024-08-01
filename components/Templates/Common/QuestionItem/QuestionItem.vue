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
			<div class="question__subtitle">
				{{ subtitle }}
			</div>
			<div class="question__info">
				<p class="question__date date">
					{{ dayjs(date).locale("ru").format("D MMMM YYYY") }}
				</p>
				<div class="question__views views">
					<IconPasswordEye />
					<span>
						{{ views }}
					</span>
				</div>
			</div>
		</div>
	</NuxtLink>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import defaultImgQuestion from "/main/questions/question.jpg";

	const dayjs = useDayjs();

	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		subtitle: {
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
	const { title, views, image, subtitle, date, id } = toRefs(props);
</script>

<style lang="scss" scoped>
	@import url("./QuestionItem.scss");
</style>
