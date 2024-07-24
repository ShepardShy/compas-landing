<template>
	<AppH2 class="title">{{ currentTitle }}</AppH2>
</template>

<script setup>
	import { storeToRefs } from "pinia";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import { useQuestionsStore } from "~/stores/questionsStore";

	const questionsStore = useQuestionsStore();
	const { currentTitle } = storeToRefs(questionsStore);
</script>

<style>
	@import url(./Title.scss);
</style>
