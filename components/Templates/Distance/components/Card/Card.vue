<template>
	<AppSection class="ibg card">
		<div class="card__text">
			<p>{{ textMap?.[route.params?.tab] }}</p>
		</div>
		<FansyBox class="fines__fansy-box">
			<AppButton
				class="fines__button"
				:data-fancybox="`finesBlock`"
				data-src="#video"
				@click="openFancy"
			>
				<div
					id="video"
					class="fines-video__top"
				>
					<iframe
						ref="videoRef"
						width="720"
						height="405"
						src="https://rutube.ru/play/embed/ea5a84506dbd9258edda2293b932d11a/?p=pb9vffOJa_eie6fWfYUqFA"
						frameBorder="0"
						allow="clipboard-write; autoplay"
						webkitAllowFullScreen
						mozallowfullscreen
						allowFullScreen
					></iframe>
					<div
						v-if="!isVideoStarted"
						@click="startVideo"
						class="fines-video__cover"
					>
						<img
							src="https://rutube.ru/api/video/ea5a84506dbd9258edda2293b932d11a/thumbnail/?redirect=1"
							alt=""
						/>
						<div class="guide__video-play play-video">
							<img
								src="/images/icons/play-rutube.svg"
								alt=""
							/>
						</div>
					</div>
				</div>

				<figure class="ibg fines__icon">
					<img
						src="/images/icons/youtube_blue.svg"
						alt="О сервисе"
					/>
				</figure>
				О сервисе
				<span class="button-text"> (1 мин 50 сек) </span>
			</AppButton>
		</FansyBox>
		<BackgroundImg />
	</AppSection>
</template>

<script setup>
	import AppSection from "~/components/AppSection/AppSection.vue";
	import BackgroundImg from "./components/BackgroundImg.vue";
	import FansyBox from "@/components/AppFansyBox/FansyBox.vue";

	const route = useRoute();

	let timeoutLoadVideo = false;
	const openFancy = () => {
		setTimeout(() => {
			timeoutLoadVideo = true;
		}, 1500);
		const checkIsIframeOpen = (e) => {
			if (!e.target.closest("#video")) {
				document.removeEventListener("pointerdown", checkIsIframeOpen);
				isVideoStarted.value = false;
			}
		};
		document.addEventListener("pointerdown", checkIsIframeOpen);
	};
	const isVideoStarted = ref(false);
	const videoRef = ref(null);

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

	const textMap = {
		mkad: "Хотите быстро узнать, сколько километров отделяет ваш пункт назначения от МКАД? Просто выберите точку на карте или введите адрес в поисковую строку, и нажмите «Рассчитать». Получите точное расстояние и удобный маршрут всего за пару кликов.",
		kad: "Хотите быстро узнать, сколько километров отделяет ваш пункт назначения от КАД? Просто выберите точку на карте или введите адрес в поисковую строку, и нажмите «Рассчитать». Получите точное расстояние и удобный маршрут всего за пару кликов.",
	};
</script>

<style scoped lang="scss">
	@import url("./Card.scss");
</style>
