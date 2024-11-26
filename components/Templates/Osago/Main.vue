<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />

	<MainFines />

	<!-- <MainQuestions /> -->
	<MainArticles
		category="4"
		class="main__questinos"
	/>
	<CommonSocial class="main__social" />
</template>

<script setup>
	import "./Main.scss";

	import MainFines from "./Fines/Fines.vue";
	import MainQuestions from "~/components/Templates/Common/QuestionsBlock/QuestionsBlock.vue";
	import MainArticles from "~/components/Templates/Common/ArticlesBlock/ArticlesBlock.vue";
	import CommonSocial from "@/components/Templates/Common/Social/Social.vue";

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
			title: "Калькулятор ОСАГО",
			link: "/products/osago",
		},
	]);

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
