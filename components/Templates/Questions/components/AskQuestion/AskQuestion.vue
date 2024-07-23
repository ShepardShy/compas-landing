<template>
	<div class="ask">
		<AppH2 class="ask__title">Не нашли что искали?</AppH2>
		<AppButton class="ask__button button_blue">Задать вопрос</AppButton>
	</div>
</template>

<script setup>
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import AppButton from "~/components/AppButton/AppButton.vue";
</script>

<style lang="scss" scoped>
	@import url(./AskQuestion.scss);
</style>
