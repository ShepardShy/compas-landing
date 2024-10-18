<template>
	<div class="item">
		<img
			:src="image"
			:alt="title"
			class="item__image"
		/>
		<div class="item__info">
			<h4 class="item__title">
				{{ title }}
			</h4>
			<p class="item__desc">
				{{ desc }}
			</p>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		image: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
	});
	const { desc, image, title } = toRefs(props);
</script>

<style lang="scss" scoped>
	@import url(./InterestItem.scss);
</style>
