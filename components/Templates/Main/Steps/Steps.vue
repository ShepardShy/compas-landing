<template>
	<AppSection class="section_without-background section_gray steps">
		<div class="steps__top">
			<AppH2 class="steps__title">Проверка и оплата штрафов ГИБДД</AppH2>
			<p class="steps__text">Проверить штрафы онлайн можно через сервис «Автокод» всего за 2 минуты. Отчет покажет взыскания, выписанные за превышение скорости, неправильную парковку и другие нарушения.</p>
		</div>
		<div class="steps__steps">
			<AppH3 class="steps__subtitle">Проверка и оплата штрафов ГИБДД</AppH3>
			<p class="steps__text">Чтобы проверить штрафы ГИБДД, нужно выполнить три простых шага.</p>
			<StepsList />
			<p class="steps__text">По ГРЗ «Автокод» найдет штрафы с камер видеофиксации, по номеру в/у – штрафы, выписанные инспектором ГИБДД.</p>
		</div>
		<FansyBox>
			<div
				href="https://www.youtube.com/watch?v=jhFDyDgMVUI"
				data-fancybox
				class="steps__video"
			>
				<YoutubeWhite class="steps__video-play" />
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
</script>

<style>
	@import url(./Steps.scss);
</style>
