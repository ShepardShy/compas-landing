<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />

	<FinesList />

	<!-- <MainCompanies
		:list="fines"
		:title="'Уже 1000 клиентов оплатили более 50 000 штрафов на 50% дешевле чем это делали раньше.'"
	/> -->
	<MainBase />
	<MainSteps />
	<MainPluses />
	<CommonProgramm
		class="main__programm"
		:title="'Проверки абсолютно бесплатны'"
		desc="Сервис «Compas.pro» собирает данные из официальных источников: ГИБДД, МАДИ, АМПП, ГИС ГМП. После проверки вы получите общее количество и сумму всех штрафов. Отчет также включает историю штрафов и детальную информацию по каждому нарушению ГИБДД."
	/>
	<PlusesFines />
	<!-- <MainTariffs /> -->
	<!-- <MainAbout :text="route.params?.type in aboutJson ? aboutJson[route.params.type].text : aboutJson.default.text" /> -->

	<!-- <MainQuestions /> -->
	<!-- <MainArticles class="main__questinos" /> -->
	<CommonSocial class="main__social" />
</template>

<script setup>
	import "./Main.scss";

	import MainBase from "./Base/Base.vue";
	import MainFines from "./Fines/Fines.vue";
	import MainPluses from "./Pluses/Pluses.vue";
	import MainSteps from "@/components/Templates/Common/Steps/Steps.vue";
	import MainAbout from "@/components/Templates/Common/WrapText/WrapText.vue";
	import MainQuestions from "~/components/Templates/Common/QuestionsBlock/QuestionsBlock.vue";
	import MainArticles from "~/components/Templates/Common/ArticlesBlock/ArticlesBlock.vue";
	import CommonSocial from "@/components/Templates/Common/Social/Social.vue";
	import MainCompanies from "@/components/Templates/Common/Companies/Companies.vue";
	import CommonProgramm from "@/components/Templates/Common/ProgrammBig/Programm.vue";
	import PlusesFines from "./PlusesFines/PlusesFines.vue";
	import FinesList from "./FinesList/FinesList.vue";

	import aboutJson from "./data/about.json";

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

	const titleMap = {
		"po-sts": "Штрафы по СТС",
		"po-voditelskomu-udostovereniyu": "Штрафы по ВУ",
		"po-nomeru-postanovleniya": "Штрафы по постановлению",
		"po-nomeru-avto": "Штрафы по гос. номеру",
		"po-inn": "Штрафы по ИНН",
	};

	// Смена вкладки
	const changeTab = async (tab) => {
		activeTab.value.tab = tab.value;
		await navigateTo(`/products/fines${activeTab.value.tab ? `/${activeTab.value.tab}` : ""}`);
	};

	// onMounted(async () => {
	// 	if (route.params.type) {
	// 		activeTab.value.tab = route.params.type;
	// 	} else {
	// 		activeTab.value.tab = "";
	// 	}
	// 	console.log(123);

	// 	await navigateTo(`/products/fines${activeTab.value.tab ? `/${activeTab.value.tab}` : ""}`);
	// });

	watch(
		() => route.params.type,
		() => {
			if (route.params.type != activeTab.value.tab) {
				activeTab.value.tab = route.params.type;
			}
		}
	);

	let breadcrumbs = computed(() => [
		{
			title: "Главная страница",
			link: "/",
		},
		{
			title: "Проверка штрафов",
			link: "/products/fines",
		},
		{
			title: "Быстрая провека штрафов",
			link: `/products/fines${activeTab.value.tab ? `/${activeTab.value.tab}` : null}`,
		},
	]);

	let companies = [
		{
			id: 0,
			title: "Аэроэкспресс",
			link: "/images/main/companies/aeroexpress.svg",
		},
		{
			id: 1,
			title: "Бургер Кинг",
			link: "/images/main/companies/burger-king-logo.svg",
		},
		{
			id: 2,
			title: "Комус",
			link: "/images/main/companies/komus.svg",
		},
		{
			id: 3,
			title: "Почта России",
			link: "/images/main/companies/russian-post-logo.svg",
		},
		{
			id: 4,
			title: "Спортмастер",
			link: "/images/main/companies/sberbank-logo.svg",
		},
		{
			id: 5,
			title: "Сбербанк",
			link: "/images/main/companies/sportmaster.svg",
		},
	];
</script>
