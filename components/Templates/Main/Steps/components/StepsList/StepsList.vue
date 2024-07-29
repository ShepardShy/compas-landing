<template>
	<div class="steps__list">
		<Step
			:name="`Шаг ${idx + 1}`"
			:text
			:isActive="activeStep == idx"
			@click="activeStep = idx"
			v-for="({ text }, idx) in steps"
		/>
	</div>
</template>

<script setup>
	import Step from "../Step/Step.vue";
	import steps from "./steps.json";

	const activeStep = ref(0);
</script>

<style lang="scss" scoped>
	@import url(./StepsList.scss);
</style>
