<template>
	<div class="header">
		<div class="header__top">
			<h1
				class="header__title"
				:class="{ header__title_little: title.length > 160 }"
			>
				{{ title }}
			</h1>
			<figure class="ibg header__image">
				<img
					:src="image ? image : defaultImage"
					:alt="title"
				/>
			</figure>
		</div>
		<div class="header__bottom">
			<div class="header__info">
				<div class="header__views views">
					<IconPasswordEye class="header__views-eye" />
					<span>
						{{ views }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import defaultImage from "/articles/defaultBg.png";
	import defaultAvatar from "/articles/defaultAvatar.png";
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
		readingTime: {
			type: Number,
			required: true,
		},
	});
	const { authorAvatar, authorDesc, authorName, authorColor, date, update, image, title, views, readingTime } = toRefs(props);
</script>

<style scoped>
	@import url(./Header.scss);
</style>
