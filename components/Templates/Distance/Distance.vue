<template>
	<AppTabs
		class="distance__links"
		:tabs="tabs"
		:isShowActions="false"
		@callAction="tab => changeTab(tab)"
	></AppTabs>

	<hr class="distance__line" />
	<AppSection class="distance section_without-background">
		<div>
			<AppH2 class="distance__title distance__title_padding">Расчет расстояния за {{ textMap[activeTab.tab] }}</AppH2>
			<DistanceCard />
		</div>
		<div class="distance__wrapper">
			<AppMap
				ref="mapComponent"
				class="distance__map"
				:item="{
					id: 0,
					title: 'Адрес',
					key: 'address',
					required: false,
					focus: false,
					value: {
						text: null,
						coords: [55.755864, 37.617698],
					},
					options: [],
					lockedOptions: [],
				}"
				:isShowMap="true"
				:isCanSelect="false"
				:isShowLabel="false"
				:isCountDistance="true"
				:mapZoom="10"
				:polygonCoords="coords?.polygon"
				:coords="coords?.coords"
				:mapStyles="{ height: '550px' }"
				:showInputLabel="false"
				:placeholder="'Адрес'"
				:isShowSubstring="false"
				:isShowInputButton="true"
				@changeValue="length => changeValue(length)"
				@selectAddress="data => selectAddress(data)"
			/>
			<DistanceCounter
				class="distance__counter"
				:title="`За ${textMap[activeTab.tab]}`"
				:count="distanceStore.textLength"
				@reset="mapComponent.resetRoute()"
			/>
		</div>
		<DistanceHistory />
		<DistanceTarif />
		<TemplateSocial class="distance__social" />
	</AppSection>
</template>

<script setup>
	import AppSection from "~/components/AppSection/AppSection.vue";
	import AppTabs from "~/components/AppTabs/Tabs.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import DistanceCard from "./components/Card/Card.vue";
	import DistanceCounter from "./components/Counter/Counter.vue";
	import DistanceHistory from "./components/History/History.vue";
	import DistanceTarif from "./components/Tarif/Tarif.vue";
	import TemplateSocial from "@/components/Templates/Common/Social/Social.vue";
	import AppMap from "@/components/AppInputs/Map/Field/Field.vue";
	import commonScripts from "@/commonScripts/commonScripts";
	import { useDistanceStore } from "~/stores/distanceStore";
	import mkadCoords from "./composables/mkadCoords";
	import kadCoords from "./composables/kadCoords";

	let coords = ref(null);
	const mapComponent = ref(null);
	const route = useRoute();

	const tabs = [
		{ id: 0, title: "Расчет расстояния за МКАД", tab: "mkad", enabled: true },
		{ id: 2, title: "Расчет расстояния за КАД", tab: "kad", enabled: true },
	];

	// Смена вкладки
	const changeTab = tab => {
		activeTab.value.tab = tab.value;
		commonScripts.setURLParams({ tab: tab.value });
		setActiveCoord(tab.value);
	};

	const textMap = {
		mkad: "МКАД",
		kad: "КАД",
	};

	const distanceStore = useDistanceStore();
	distanceStore.textLength = "0";

	let activeTab = ref({
		type: null,
		tab: "mkad",
	});

	// Выбор адреса
	const selectAddress = data => {
		distanceStore.history.unshift({ ...data, distanceType: textMap[activeTab.value.tab], id: ++distanceStore.historyId });
		if (distanceStore.history.length > 5) distanceStore.history.splice(5, distanceStore.history.length - 5);
	};

	// Установка координат
	const setActiveCoord = type => {
		switch (type) {
			case "mkad":
				coords.value = mkadCoords;
				break;

			case "kad":
				coords.value = kadCoords;
				break;

			default:
				break;
		}
	};

	// Установка длины
	const changeValue = length => {
		distanceStore.textLength = length;
	};

	provide("activeTab", activeTab);

	onMounted(() => {
		if (route.query.tab) {
			activeTab.value.tab = route.query.tab;
		} else {
			activeTab.value.tab = "mkad";
		}

		commonScripts.setURLParams({ tab: activeTab.value.tab });
		setActiveCoord(activeTab.value.tab);
	});
</script>

<style>
	@import url(./Distance.scss);
</style>
