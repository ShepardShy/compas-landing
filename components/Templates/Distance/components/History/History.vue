<template>
	<div class="history">
		<AppH2 class="distance__title">История поиска по IP</AppH2>

		<div class="history__items">
			<HistoryItem
				v-if="distanceStore.history.length > 0"
				v-for="({ id, address, date, distance, distanceType, time }, index) in distanceStore.history"
				:address
				:date
				:distance
				:distanceType
				:time
				:key="id"
			/>
			<div
				class="history__item_empty"
				v-else
			>
				Нет истории
			</div>
		</div>
	</div>
</template>

<script setup>
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import HistoryItem from "./components/HistoryItem/HistoryItem.vue";
	import { useDistanceStore } from "~/stores/distanceStore";

	const distanceStore = useDistanceStore();

	let colorFirst = "red";
</script>

<style scoped lang="scss">
	@import url("./History.scss");
</style>
