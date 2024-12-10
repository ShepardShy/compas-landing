<template>
	<NuxtLink
		class="guide__item"
		:to="`/guides/${id}`"
	>
		<div class="guide__top">
			<div
				v-if="video"
				class="guide__video"
			>
				<img
					class="guide__video"
					:src="`https://rutube.ru/api/video/${videoId}/thumbnail/?redirect=1`"
					alt=""
				/>
				<div class="guide__video-play">
					<img
						src="/images/icons/play-rutube.svg"
						alt=""
					/>
				</div>
			</div>
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
	import defaultImgguide from "/images/articles/article.png";
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

	const videoLinkArr = video.value.split("/");
	// id Видео
	let videoId = videoLinkArr[videoLinkArr.length - 1];
	if (videoLinkArr[videoLinkArr.length - 1] == "") {
		videoLinkArr.splice(videoLinkArr.length - 1, 1);
		videoId = videoLinkArr[videoLinkArr.length - 1];
	}
</script>

<style lang="scss">
	@import url("./GuideItem.scss");
</style>
