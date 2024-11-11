<template>
	<div class="step">
		<div
			class="step__name"
			:class="{ step__name_active: isActive }"
		>
			{{ name }}
		</div>
		<div
			class="step__text"
			:class="{ step__text_active: isActive }"
		>
			{{ text }}
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		text: { type: String, required: true },
		name: { type: String, required: true },
		isActive: { type: Boolean },
	});
	const { isActive, name, text } = toRefs(props);
</script>

<style>
	@import url(./Step.scss);
</style>
