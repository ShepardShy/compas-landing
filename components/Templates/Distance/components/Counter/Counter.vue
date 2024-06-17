<template>
	<AppSection class="counter">
		<p class="counter__title">{{ title }}</p>
		<p class="counter__count">{{ count }}</p>
		<AppButton
			@click="$emit('reset')"
			class="counter__btn button_blue"
			>Сбросить</AppButton
		>
	</AppSection>
</template>

<script setup>
	import AppSection from "~/components/AppSection/AppSection.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";

	const props = defineProps({
		title: {
			required: true,
			type: String,
		},
		count: {
			required: true,
			type: String,
		},
	});

	const emits = defineEmits(["reset"]);
</script>

<style scoped lang="scss">
	@import url("./Counter.scss");
</style>
