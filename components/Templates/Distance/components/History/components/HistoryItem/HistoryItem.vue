<template>
	<div class="item">
		<p class="item__address item__text">{{ address }}</p>

		<p class="item__distance item__text">
			<span class="item__text_gray">За {{ distanceType }}:</span>
			<span
				class="item__text_bold"
				v-html="distance"
			></span>
		</p>

		<p class="item__time item__text">
			<span>{{ date }}</span>
			<span class="item__text_bold">{{ time }}</span>
		</p>
	</div>
</template>

<script setup>
	const props = defineProps({
		address: {
			type: String,
		},
		distanceType: {
			type: String,
		},
		distance: {
			type: String,
		},
		date: {
			type: String,
		},
		time: {
			type: String,
		},
	});
</script>

<style lang="scss" scoped>
	@import url(./HistoryItem.scss);
</style>
