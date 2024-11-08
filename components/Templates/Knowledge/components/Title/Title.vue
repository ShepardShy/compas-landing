<template>
	<AppH1 class="title">{{ props.title }}</AppH1>
</template>

<script setup>
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";

	const props = defineProps({
		title: { type: String, required: true },
	});
</script>

<style>
	@import url(./Title.scss);
</style>
