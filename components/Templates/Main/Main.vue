<template>
	<AppTabs
		class="distance__links"
		:tabs="tabs"
		:isShowActions="false"
		@callAction="tab => changeTab(tab)"
	></AppTabs>
	<MainFines />
	<MainCompanies
		:list="fines"
		:title="'1 000 компаний проверили и оплатили более 50 000 штрафов на 50% дешевле чем это делали раньше.'"
		:desc="'Бесплатная проверка авто, водителей, компании на наличие штрафов'"
	/>
	<MainBase />
	<MainPluses />
	<CommonProgramm
		class="main__programm"
		:title="'Проверки абсолютно бесплатны'"
		:desc="'Вы можете проверять неограниченное кол-во машин на наличие штрафов и оплачивать в одном интерфейсе'"
	/>
	<!-- <MainTariffs /> -->
	<PlusesFines />
	<CommonSocial class="main__social" />
</template>

<script setup>
	import "./Main.scss";

	import MainBase from "./Base/Base.vue";
	import MainFines from "./Fines/Fines.vue";
	import MainPluses from "./Pluses/Pluses.vue";
	import MainCompanies from "@/components/Templates/Common/Companies/Companies.vue";
	import CommonProgramm from "@/components/Templates/Common/Programm/Programm.vue";
	// import MainTariffs from '@/components/Templates/Main/Tariffs/Tariffs.vue';
	import PlusesFines from "./PlusesFines/PlusesFines.vue";
	import AppTabs from "~/components/AppTabs/Tabs.vue";
	import CommonSocial from "@/components/Templates/Common/Social/Social.vue";

	const route = useRoute();

	let activeTab = ref({
		type: null,
		tab: "po-sts",
	});
	provide("activeTab", activeTab);

	// Табы
	const tabs = [
		{ id: 0, title: "ГИБДД", tab: "", enabled: true },
		{ id: 1, title: "по СТС", tab: "po-sts", enabled: true },
		{ id: 2, title: "по ВУ", tab: "po-voditelskomu-udostovereniyu", enabled: true },
		{ id: 3, title: "по постановлению", tab: "po-nomeru-postanovleniya", enabled: true },
		{ id: 4, title: "по гос номеру", tab: "po-nomeru-avto", enabled: true },
		{ id: 5, title: "по ИНН", tab: "po-inn", enabled: true },
		{ id: 6, title: "за платон", tab: "za-platon", enabled: true },
		{ id: 7, title: "за парковку", tab: "za-parkovku", enabled: true },
	];

	// Смена вкладки
	const changeTab = async tab => {
		activeTab.value.tab = tab.value;
		await navigateTo(`/products/fines/${activeTab.value.tab}`);
	};

	onMounted(async () => {
		if (route.params.type) {
			activeTab.value.tab = route.params.type;
		} else {
			activeTab.value.tab = "";
		}
		await navigateTo(`/products/fines/${activeTab.value.tab}`);
	});

	watch(
		() => route.params.type,
		() => {
			if (route.params.type != activeTab.value.tab) {
				activeTab.value.tab = route.params.type;
			}
		}
	);

	let companies = [
		{
			id: 0,
			title: "Аэроэкспресс",
			link: "/main/companies/aeroexpress.svg",
		},
		{
			id: 1,
			title: "Бургер Кинг",
			link: "/main/companies/burger-king-logo.svg",
		},
		{
			id: 2,
			title: "Комус",
			link: "/main/companies/komus.svg",
		},
		{
			id: 3,
			title: "Почта России",
			link: "/main/companies/russian-post-logo.svg",
		},
		{
			id: 4,
			title: "Спортмастер",
			link: "/main/companies/sberbank-logo.svg",
		},
		{
			id: 5,
			title: "Сбербанк",
			link: "/main/companies/sportmaster.svg",
		},
	];
</script>
