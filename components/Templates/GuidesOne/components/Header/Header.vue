<template>
	<div class="header">
		<div class="header__top">
			<!-- <Video
				class="header__video"
				:src="video"
				ref="videoRef"
			/> -->
			<iframe
				class="header__video"
				ref="videoRef"
				width="720"
				height="405"
				:src="video"
				frameBorder="0"
				allow="clipboard-write; autoplay"
				webkitAllowFullScreen
				mozallowfullscreen
				allowFullScreen
			></iframe>
			<div
				v-if="!isVideoStarted"
				@click="startVideo"
				class="header__video-cover"
			>
				<img
					:src="`https://rutube.ru/api/video/${videoId}/thumbnail/?redirect=1`"
					alt=""
				/>
				<div class="guide__video-play play-video">
					<img
						src="/icons/play-rutube.svg"
						alt=""
					/>
				</div>
			</div>
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
				<div class="header__views views">
					<IconPasswordEye class="header__views-eye" />
					<span>
						{{ views }}
					</span>
				</div>
				<div class="header__duration duration">
					Читать гайд: <span class="duration_black">{{ readingTime }} мин</span>
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

	const isVideoStarted = ref(false);
	const videoRef = ref(null);

	let timeoutLoadVideo = false;
	onMounted(() => {
		setTimeout(() => {
			timeoutLoadVideo = true;
		}, 1500);
	});

	function play() {
		if (!timeoutLoadVideo) {
			setTimeout(() => {
				var player = videoRef.value;
				player.contentWindow.postMessage(
					JSON.stringify({
						type: "player:play",

						data: {},
					}),
					"*"
				);
			}, 1500);
			return;
		}
		var player = videoRef.value;
		player.contentWindow.postMessage(
			JSON.stringify({
				type: "player:play",

				data: {},
			}),
			"*"
		);
	}

	const startVideo = async () => {
		isVideoStarted.value = true;
		await nextTick();
		play();
	};

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

	const videoLinkArr = video.value.split("/");
	// id Видео
	let videoId = videoLinkArr[videoLinkArr.length - 1];
	if (videoLinkArr[videoLinkArr.length - 1] == "") {
		videoLinkArr.splice(videoLinkArr.length - 1, 1);
		videoId = videoLinkArr[videoLinkArr.length - 1];
	}
</script>

<style scoped>
	@import url(./Header.scss);
</style>
