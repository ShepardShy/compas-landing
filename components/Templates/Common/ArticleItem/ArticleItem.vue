<template>
	<div
		class="article__item"
		@click="navigateTo(`/articles/${value}`)"
	>
		<div class="article__top">
			<figure class="ibg article__icon">
				<img
					:src="image ? image : defaultImgarticle"
					:alt="title"
				/>
			</figure>
		</div>
		<div class="article__body">
			<div class="article__subtitle">
				{{ text }}
			</div>
			<div class="article-slder__views">
				<IconPasswordEye />
				<span>
					{{ views }}
				</span>
			</div>
			<div class="article-slder__date">
				{{ dayjs(date).locale("ru").format("D MMMM YYYY") }}
			</div>
		</div>
	</div>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import defaultImgarticle from "/articles/article.png";
	import "dayjs/locale/ru";

	const dayjs = useDayjs();

	const props = defineProps({
		text: {
			type: String,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
		views: {
			type: Number,
			default: 0,
		},
		value: {
			type: String,
			default: "",
		},
	});
	const { text, views, image, date, value } = toRefs(props);
</script>

<style lang="scss" scoped>
	@import url("./articleItem.scss");
</style>
