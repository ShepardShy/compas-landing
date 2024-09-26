<template>
	<div class="steps__list">
		<Step
			:name="`Шаг ${id}`"
			:text
			:isActive="activeStep == id"
			@click="activeStep = id"
			v-for="{ text, id } in steps"
		/>
	</div>
</template>

<script setup>
	import Step from "../Step/Step.vue";

	const props = defineProps({
		steps: { type: Array, required: true },
	});
	const { steps } = toRefs(props);
	const activeStep = defineModel();
</script>

<style lang="scss" scoped>
	@import url(./StepsList.scss);
</style>
