<template>
	<div class="header">
		<div class="header__top">
			<h1 class="header__title">{{ title }}</h1>
			<figure class="ibg header__image">
				<img
					:src="image ? image : defaultImage"
					:alt="title"
				/>
			</figure>
		</div>
		<div class="header__bottom">
			<div class="header__author">
				<img
					:src="authorAvatar ? authorAvatar : defaultAvatar"
					:alt="authorName"
					class="header__author-avatar"
				/>
				<div class="header__author-info">
					<div class="header__author-name">{{ authorName }}</div>
					<div class="header__author-desc">{{ authorDesc }}</div>
				</div>
			</div>
			<div class="header__info">
				<div class="header__date date">{{ dayjs(date).locale("ru").format("D MMMM YYYY") }}</div>
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
	import defaultImage from "/articles/defaultBg.jpg";
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
		date: {
			type: String,
			required: true,
		},
		views: {
			type: Number,
			required: true,
		},
	});
	const { authorAvatar, authorDesc, authorName, date, image, title, views } = toRefs(props);
</script>

<style scoped>
	@import url(./Header.scss);
</style>
