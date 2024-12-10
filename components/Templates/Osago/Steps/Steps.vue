<template>
	<AppSection class="section_without-background section_gray steps">
		<div class="steps__top">
			<AppH2 class="steps__title">Проверка и оплата штрафов ГИБДД</AppH2>
			<p class="steps__text">
				С помощью сервиса «Compas.pro» вы можете быстро и удобно проверить штрафы ГИБДД онлайн всего за пару минут. Отчет включает штрафы за превышение скорости, неправильную парковку и другие
				нарушения.
			</p>
		</div>
		<div class="steps__steps">
			<AppH3 class="steps__subtitle">Проверка и оплата штрафов ГИБДД</AppH3>
			<p class="steps__text">Чтобы проверить и оплатить штрафы ГИБДД, нужно выполнить пять простых шагов.</p>
			<StepsList
				v-model="activeStep"
				:steps
			/>

			<p class="steps__text steps__text_margin">
				Чтобы оплатить штраф, убедитесь, что у вас достаточно средств на балансе личного кабинета нашего сервиса. Оплата штрафов производится с вашего баланса в Compas.pro.
			</p>
			<p class="steps__text">При проверке по гос номеру вы найдете штрафы с камер видеофиксации, по номеру водительского удостоверения - выписанные инспекторами ГИБДД.</p>
		</div>
		<FansyBox class="steps__video-wrapper">
			<div
				href="https://www.youtube.com/watch?v=jhFDyDgMVUI"
				data-fancybox
				data-src="#video"
				class="steps__video"
			>
				<img
					class="steps__video-img"
					src="https://rutube.ru/api/video/8e8987113cc8cda11efb0b2f2c245f7c/thumbnail/?redirect=1"
					alt="background-img"
				/>
				<div class="steps__video-play">
					<img
						src="/images/icons/play-rutube.svg"
						alt=""
					/>
				</div>

				<iframe
					id="video"
					data-fancybox
					width="720"
					height="405"
					src="https://rutube.ru/play/embed/8e8987113cc8cda11efb0b2f2c245f7c/"
					frameBorder="0"
					allow="clipboard-write; autoplay"
					webkitAllowFullScreen
					mozallowfullscreen
					allowFullScreen
				></iframe>
			</div>
		</FansyBox>
	</AppSection>
</template>

<script setup>
	import AppSection from "~/components/AppSection/AppSection.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import AppH3 from "@/components/AppHeaders/H3/H3.vue";
	import StepsList from "./components/StepsList/StepsList.vue";
	import YoutubeWhite from "~/components/AppIcons/YoutubeWhite/YoutubeWhite.vue";
	import FansyBox from "~/components/AppFansyBox/FansyBox.vue";

	import steps from "./composables/steps.json";

	const activeStep = ref(1);
</script>

<style>
	@import url(./Steps.scss);
</style>
