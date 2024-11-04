<template>
	<AppH2 class="title">{{ props.title }}</AppH2>
</template>

<script setup>
	import { storeToRefs } from "pinia";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";

	const props = defineProps({
		title: { type: String, required: true },
	});
</script>

<style>
	@import url(./Title.scss);
</style>
