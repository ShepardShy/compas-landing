<template>
	<AppSection class="distance section_without-background">
		<!-- <AppBreadcrambs
			class="distance__breadcrambs"
			:breadcrumbs="breadcrumbs"
		/> -->

		<AppTabs
			class="distance__links"
			:tabs="tabs"
			:isShowActions="false"
			@callAction="tab => changeTab(tab)"
		></AppTabs>

		<hr class="distance__line" />
		<AppH1 class="distance__title_no-size distance__title_padding distance__header">Расчет расстояния за {{ textMap[activeTab.tab] }}</AppH1>

		<DistanceCard />
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
				:mapStyles="{ height: '34.375rem' }"
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
	import AppH1 from "@/components/AppHeaders/H1/MobileMenu/MobileMenu.vue";
	import DistanceCard from "./components/Card/Card.vue";
	import DistanceCounter from "./components/Counter/Counter.vue";
	import DistanceHistory from "./components/History/History.vue";
	import DistanceTarif from "./components/Tarif/Tarif.vue";
	import TemplateSocial from "@/components/Templates/Common/Social/Social.vue";
	import AppMap from "@/components/AppInputs/Map/Field/Field.vue";
	import { useDistanceStore } from "~/stores/distanceStore";
	import mkadCoords from "./composables/mkadCoords";
	import kadCoords from "./composables/kadCoords";
	import AppMenu from "@/components/AppMenu/AppMenu.vue";
	import { useGlobalStore } from "~/stores/globalStore";

	const globalStore = useGlobalStore();
	globalStore.isShowMobileMenu = false;
	onBeforeRouteLeave(() => {
		globalStore.isShowMobileMenu = true;
	});

	let coords = ref(null);
	const mapComponent = ref(null);
	const route = useRoute();

	const tabs = [
		{ id: 0, title: "Расчет расстояния за МКАД", tab: "mkad", enabled: true },
		{ id: 2, title: "Расчет расстояния за КАД", tab: "kad", enabled: true },
	];

	// Смена вкладки
	const changeTab = async tab => {
		activeTab.value.tab = tab.value;
		await navigateTo({ params: { tab: tab.value } });
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

	onMounted(async () => {
		if (route.params.tab) {
			activeTab.value.tab = route.params.tab;
		} else {
			activeTab.value.tab = "mkad";
		}

		await navigateTo(`/products/distance/${activeTab.value.tab}`);
		setActiveCoord(activeTab.value.tab);
	});

	watch(
		() => route.params.tab,
		() => {
			if (route.params.tab != activeTab.value.tab) {
				activeTab.value.tab = route.params.tab;
				setActiveCoord(activeTab.value.tab);
			}
		}
	);

	let breadcrumbs = [
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Расчет расстояния",
			link: `/tariffs`,
		},
	];
</script>

<style lang="scss">
	@import url(./Distance.scss);
</style>
