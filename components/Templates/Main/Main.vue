<template>
	<AppTabs
		class="main__links"
		:tabs="tabs"
		:isShowActions="false"
		@callAction="tab => changeTab(tab)"
	></AppTabs>
	<hr class="main__line" />
	<MainFines />
	<MainCompanies
		:list="fines"
		:title="'1 000 компаний проверили и оплатили более 50 000 штрафов на 50% дешевле чем это делали раньше.'"
		:desc="'Бесплатная проверка авто, водителей, компании на наличие штрафов'"
	/>
	<MainBase />
	<MainSteps />
	<MainPluses />
	<CommonProgramm
		class="main__programm"
		:title="'Проверки абсолютно бесплатны'"
		:desc="'«Автокод» собирает информацию из официальных источников: ГИБДД, МАДИ, АМПП, ГИС ГМП. После проверки увидите общее количество и общую сумму штрафов. Также в отчете будет история штрафов и отдельная информация по каждому штрафу ГИБДД:'"
	/>
	<PlusesFines />
	<!-- <MainTariffs /> -->
	<MainAbout />
	<MainQuestions />
	<MainArticles class="main__questinos" />
	<CommonSocial class="main__social" />
</template>

<script setup>
	import "./Main.scss";

	import MainBase from "./Base/Base.vue";
	import MainFines from "./Fines/Fines.vue";
	import MainPluses from "./Pluses/Pluses.vue";
	import MainSteps from "./Steps/Steps.vue";
	import MainAbout from "./About/About.vue";
	import MainQuestions from "./Questions/Questions.vue";
	import MainArticles from "./Articles/Articles.vue";
	import CommonSocial from "@/components/Templates/Common/Social/Social.vue";
	import MainCompanies from "@/components/Templates/Common/Companies/Companies.vue";
	import CommonProgramm from "@/components/Templates/Common/ProgrammBig/Programm.vue";
	// import MainTariffs from '@/components/Templates/Main/Tariffs/Tariffs.vue';
	import PlusesFines from "./PlusesFines/PlusesFines.vue";
	import AppTabs from "~/components/AppTabs/Tabs.vue";

	const route = useRoute();

	let activeTab = ref({
		type: null,
		tab: "po-sts",
	});
	provide("activeTab", activeTab);

	// Табы
	const tabs = [
		{ id: 1, title: "Штрафы по СТС", tab: "po-sts", enabled: true },
		{ id: 2, title: "Штрафы по ВУ", tab: "po-voditelskomu-udostovereniyu", enabled: true },
		{ id: 3, title: "Штрафы по постановлению", tab: "po-nomeru-postanovleniya", enabled: true },
		{ id: 4, title: "Штрафы по гос. номеру", tab: "po-nomeru-avto", enabled: true },
		{ id: 5, title: "Штрафы по ИНН", tab: "po-inn", enabled: true },
	];

	// Смена вкладки
	const changeTab = async tab => {
		activeTab.value.tab = tab.value;
		await navigateTo(`/products/fines${activeTab.value.tab ? `/${activeTab.value.tab}` : ""}`);
	};

	onMounted(async () => {
		if (route.params.type) {
			activeTab.value.tab = route.params.type;
		} else {
			activeTab.value.tab = "";
		}
		await navigateTo(`/products/fines${activeTab.value.tab ? `/${activeTab.value.tab}` : ""}`);
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
