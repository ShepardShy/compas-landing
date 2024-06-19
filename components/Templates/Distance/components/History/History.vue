<template>
	<div class="history">
		<AppH2 class="distance__title">История поиска по IP</AppH2>

		<HistoryItem />
	</div>
</template>

<script setup>
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import HistoryItem from "./components/HistoryItem/HistoryItem.vue";
</script>

<style scoped lang="scss">
	@import url("./History.scss");
</style>
