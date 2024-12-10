<template>
	<AppSection class="main-page section_without-background">
		<!-- <AppH1 class="main-page__title"> Компас позволяет отслеживать все штрафы ГИБДД по личной или автопарку машин. </AppH1> -->
		<form class="main-page__form">
			<div class="main-page__container">
				<AppH1 class="main-page__form-title"
					>Компас Про - удобное управление транспортом
					<p class="main-page__form-subtitle">Позволяет отслеживать и оплачивать все штрафы ГИБДД по личной машине или автопарку машин.</p>
				</AppH1>

				<div class="main-page__form-actions main-page__actions">
					<FansyBox class="main-page__fansy-box">
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
									src="https://rutube.ru/play/embed/15f4b3bced1a43b00648295076c493fa/"
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
										:src="`https://rutube.ru/api/video/15f4b3bced1a43b00648295076c493fa/thumbnail/?redirect=1`"
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
							<span class="button-text"> (3 мин 3 сек) </span>
						</AppButton>
					</FansyBox>
				</div>
			</div>
		</form>

		<figure class="ibg main-page__image">
			<img
				:src="defaultImage"
				alt="Проверьте штрафы и зарегистрируйтесь в 1 клик"
			/>
		</figure>
	</AppSection>
</template>

<script setup>
	import _ from "lodash";
	import FinesWarning from "./Warning/Warning.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
	import AppInput from "@/components/AppInputs/Input/Input.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";
	import FansyBox from "@/components/AppFansyBox/FansyBox.vue";
	import ValidateField from "@/components/AppTable/Validate.js";
	import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue";
	import api from "@/helpers/api.js";
	import { useCommonStore } from "@/stores/commonStore.js";
	import { storeToRefs } from "pinia";

	// Картинки проверки штрафов
	import vuImage from "/images/main/fines/preview-vu.png";
	import stsImage from "/images/main/fines/preview-sts.png";
	import gosImage from "/images/main/fines/preview-gos.png";
	import postanovlenieImage from "/images/main/fines/preview-postanovlenie.png";
	import innImage from "/images/main/fines/preview-inn.png";
	import defaultImage from "/images/main/fines/main-preview.png";

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
</script>

<style>
	@import url(./Fines.scss);
</style>
