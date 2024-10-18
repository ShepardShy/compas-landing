<template>
	<div class="items__wrapper">
		<AppH2 class="items__title">{{ title }}</AppH2>
		<div class="items">
			<InterestItem
				:title
				:desc
				:image
				v-for="{ title, desc, image } in items"
			/>
		</div>
	</div>
</template>

<script setup>
	import InterestItem from "./InterestItem/InterestItem.vue";
	import AppH2 from "~/components/AppHeaders/H2/H2.vue";

	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		items: {
			type: Array,
			required: true,
		},
	});
	const { items, title } = toRefs(props);
</script>

<style lang="scss" scoped>
	@import url(./InterestItems.scss);
</style>
