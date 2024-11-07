<template>
	<div class="header">
		<div class="header__top">
			<Video
				class="header__video"
				:src="video"
			/>
		</div>
		<div class="header__bottom">
			<div class="header__author">
				<img
					v-if="!Array.isArray(authorAvatar) && authorAvatar"
					:src="authorAvatar ? authorAvatar : defaultAvatar"
					:alt="authorName"
					class="header__author-avatar"
				/>
				<div
					v-else
					:style="`background:${authorColor};`"
					class="header__author-avatar"
				>
					{{ authorName[0] }}
				</div>
				<div class="header__author-info">
					<div class="header__author-name">{{ authorName }}</div>
					<div class="header__author-desc">{{ authorDesc }}</div>
				</div>
			</div>
			<div class="header__info">
				<div class="header__date date">
					{{ dayjs(date).locale("ru").format("D MMMM YYYY") }}
					<div v-if="update && dayjs(update).startOf('date') != dayjs(date).startOf('date')">
						(<span class="header__date-green">Обновлено</span> {{ dayjs(update).locale("ru").format("DD.MM.YYYY") }})
					</div>
				</div>
				<div class="header__views views">
					<IconPasswordEye class="header__views-eye" />
					<span>
						{{ views }}
					</span>
				</div>
				<div class="header__duration duration">
					Читать статью: <span class="duration_black">{{ readingTime }} мин</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import defaultImage from "/articles/defaultBg.png";
	import defaultAvatar from "/articles/defaultAvatar.png";
	import Video from "../Video/Video.vue";
	import "dayjs/locale/ru";

	const dayjs = useDayjs();

	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		authorAvatar: {
			type: String,
			required: true,
		},
		authorName: {
			type: String,
			required: true,
		},
		authorDesc: {
			type: String,
			required: true,
		},
		authorColor: {
			type: String,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
		update: {
			type: String,
			default: false,
		},
		views: {
			type: Number,
			required: true,
		},
		video: {
			type: String,
			required: true,
		},
		readingTime: {
			type: Number,
			required: true,
		},
	});
	const { authorAvatar, authorDesc, video, authorName, authorColor, date, update, image, title, views, readingTime } = toRefs(props);
</script>

<style scoped>
	@import url(./Header.scss);
</style>
