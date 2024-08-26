<template>
	<NuxtLink
		class="article__item"
		:to="`/articles/${id}`"
	>
		<div class="article__top">
			<img
				class="article__icon"
				:src="image ? image : defaultImgarticle"
				:alt="title"
			/>
		</div>
		<div class="article__body">
			<div class="article__subtitle">
				{{ title }}
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
	</NuxtLink>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import defaultImgarticle from "/articles/article.png";
	import "dayjs/locale/ru";

	const dayjs = useDayjs();

	const props = defineProps({
		title: {
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
		id: {
			type: String,
			default: "",
		},
	});
	const { title, views, image, date, id } = toRefs(props);
</script>

<style lang="scss" scoped>
	@import url("./articleItem.scss");
</style>
