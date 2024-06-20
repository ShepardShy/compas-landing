<template>
	<div class="distance__links">
		<NuxtLink
			class="distance__link"
			:class="{ active: activeTab == 'mkad' }"
			to="distance?tab=mkad"
			>Расчет расстояния за МКАД</NuxtLink
		>
		<NuxtLink
			class="distance__link"
			:class="{ active: activeTab == 'kad' }"
			to="distance?tab=kad"
			>Расчет расстояния за КАД</NuxtLink
		>
	</div>

	<hr class="distance__line" />
	<AppSection class="distance section_without-background">
		<div>
			<AppH2 class="distance__title distance__title_padding">Расчет расстояния за {{ textMap[activeTab] }}</AppH2>
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
				:title="`За ${textMap[activeTab]}`"
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

	const textMap = {
		mkad: "МКАД",
		kad: "КАД",
	};

	const distanceStore = useDistanceStore();
	distanceStore.textLength = "0";

	let activeTab = ref("mkad");
	const router = useRoute();

	const selectAddress = data => {
		distanceStore.history.unshift({ ...data, distanceType: textMap[activeTab.value], id: ++distanceStore.historyId });
		if (distanceStore.history.length > 5) distanceStore.history.splice(5, distanceStore.history.length - 5);
	};

	const changeValue = length => {
		distanceStore.textLength = length;
	};

	onMounted(() => {
		if (router.query.tab) {
			activeTab.value = router.query.tab;
			router.query.tab == "mkad" ? (coords.value = mkadCoords) : 0;
			router.query.tab == "kad" ? (coords.value = kadCoords) : 0;
		} else {
			activeTab.value = "mkad";
			coords.value = mkadCoords;
			commonScripts.setURLParams({ tab: activeTab.value });
		}

		localStorage.clear();
	});

	watch(
		() => router.query,
		newVal => {
			if (router.query.tab) {
				activeTab.value = newVal.tab;

				newVal.tab == "mkad" ? (coords.value = mkadCoords) : 0;
				newVal.tab == "kad" ? (coords.value = kadCoords) : 0;
			} else {
				activeTab.value = "mkad";
				coords.value = mkadCoords;
				commonScripts.setURLParams({ tab: activeTab.value });
			}
		},
		{
			deep: true,
		}
	);
</script>

<style>
	@import url(./Distance.scss);
</style>
