<template>
	<NuxtLink
		class="guide__item"
		:to="`/guides/${id}`"
	>
		<div class="guide__top">
			<iframe
				class="guide__video"
				v-if="video"
				width="720"
				height="405"
				src="https://rutube.ru/play/embed/07d0473704735c6266920f9d89c011ca/"
				frameBorder="0"
				allow="clipboard-write; autoplay"
				webkitAllowFullScreen
				mozallowfullscreen
				allowFullScreen
			></iframe>
			<img
				v-else
				class="guide__icon"
				:src="defaultImgguide"
				:alt="title"
			/>
		</div>
		<div class="guide__body">
			<div class="guide__title">
				{{ title }}
			</div>
		</div>
	</NuxtLink>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import defaultImgguide from "/articles/article.png";
	import "dayjs/locale/ru";

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
		video: {
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
	const { title, views, image, video, date, id } = toRefs(props);
</script>

<style lang="scss">
	@import url("./GuideItem.scss");
</style>
