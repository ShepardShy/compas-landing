<template>
	<div class="mobile">
		<div class="container container_mobile">
			<div class="mobile__wrapper">
				<div class="mobile__left">
					<AppH2 class="mobile__title">Скачайте приложение Compas Pro для удобного управления порталом</AppH2>
					<SubTitle />
					<Download />
				</div>
				<img
					src="/mobile/phoneBg.png"
					alt="Скачайте приложение Compas Pro"
					class="mobile__img"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import SubTitle from "./components/SubTitle/SubTitle.vue";
	import Download from "./components/Download/Download.vue";
</script>

<style lang="scss">
	@import url("./MobileApp.scss");
</style>
