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
			<AppH2 class="distance__title">Расчет расстояния за {{ textMap[activeTab] }}</AppH2>
			<DistanceCard />
		</div>
		<div class="distance__wrapper">
			<!-- <AppInput
				class="distance__input"
				:item="{
					id: 0,
					required: false,
					substring: null,
					type: 'text',
					title: 'Название категории',
					placeholder: 'Адрес',
					value: distanceStore.value,
					key: 'destionation',
					focus: false,
				}"
			/> -->
			<AppMap
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
				:polygonCoords="mkadCoords"
				:mapStyles="{ height: '550px' }"
				:showInputLabel="false"
				:placeholder="'Адрес'"
				:isShowSubstring="false"
				@changeValue="length => changeValue(length)"
			/>
			<DistanceCounter
				:title="`За ${textMap[activeTab]}`"
				:count="distanceStore.textLength"
			/>
		</div>

		<

		<TemplateSocial />
	</AppSection>
</template>

<script setup>
	import AppSection from "~/components/AppSection/AppSection.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import DistanceCard from "./components/Card/Card.vue";
	import DistanceCounter from "./components/Counter/Counter.vue";
	import AppInput from "~/components/AppInputs/Input/InputField/InputField.vue";
	import TemplateSocial from "@/components/Templates/Common/Social/Social.vue";
	import AppMap from "@/components/AppInputs/Map/Field/Field.vue";
	import commonScripts from "@/commonScripts/commonScripts";
	import { useDistanceStore } from "~/stores/distanceStore";
	import mkadCoords from "./composables/mkadCoords";

	const textMap = {
		mkad: "МКАД",
		kad: "КАД",
	};

	const distanceStore = useDistanceStore();

	let activeTab = ref("mkad");
	const router = useRoute();

	const changeActiveTab = tab => {
		activeTab.value = tab;
		router.query.tab = tab;
		commonScripts.setURLParams({ tab: tab });
	};

	const changeValue = length => {
		distanceStore.textLength = length;
	};

	onMounted(() => {
		if (router.query.tab) {
			activeTab.value = router.query.tab;
		} else {
			activeTab.value = "mkad";
			commonScripts.setURLParams({ tab: activeTab.value });
		}

		localStorage.clear();
	});

	watch(
		() => router.query,
		() => {
			if (router.query.tab) {
				activeTab.value = router.query.tab;
			} else {
				activeTab.value = "mkad";
				commonScripts.setURLParams({ tab: activeTab.value });
			}
		},
		{
			deep: true,
		}
	);
</script>

<style scoped>
	@import url(./Distance.scss);
</style>
