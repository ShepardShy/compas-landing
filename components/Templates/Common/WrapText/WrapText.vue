<template>
	<div class="wrap">
		<img
			v-if="image"
			:src="image"
			alt="image"
			class="wrap__image"
		/>
		<div
			v-html="text"
			class="wrap__text"
		></div>
	</div>
</template>

<script setup>
	const props = defineProps({
		text: { type: String },
		image: { type: String },
	});
	const { image, text } = toRefs(props);
</script>

<style>
	@import url(./WrapText.scss);
</style>
