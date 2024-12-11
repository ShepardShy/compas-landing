<template>
	<!-- <AppBreadcrambs :breadcrumbs="breadcrumbs" /> -->

	<MainFines />

	<MainCompanies
		:list="fines"
		:title="'Уже более 1000 клиентов пользуются сервисом Компас Про.'"
	/>
	<!-- <MainBase /> -->
	<!-- <MainSteps /> -->
	<!-- <MainPluses /> -->
	<!-- <CommonProgramm
		class="main__programm"
		:title="'Проверки абсолютно бесплатны'"
		desc="Сервис «Compas.pro» собирает данные из официальных источников: ГИБДД, МАДИ, АМПП, ГИС ГМП. После проверки вы получите общее количество и сумму всех штрафов. Отчет также включает историю штрафов и детальную информацию по каждому нарушению ГИБДД."
	/> -->
	<PlusesFines />
	<MainTariffs />
	<!-- <MainAbout :text="route.params?.type in aboutJson ? aboutJson[route.params.type].text : aboutJson.default.text" /> -->

	<!-- <MainQuestions /> -->
	<MainArticles class="main__questinos" />
	<CommonSocial class="main__social" />
</template>

<script setup>
	import "./Main.scss";

	import MainFines from "./Fines/Fines.vue";
	import MainArticles from "~/components/Templates/Common/ArticlesBlock/ArticlesBlock.vue";
	import CommonSocial from "@/components/Templates/Common/Social/Social.vue";
	import MainCompanies from "@/components/Templates/Common/Companies/Companies.vue";
	import MainTariffs from "@/components/Templates/MainPage/Tariffs/Tariffs.vue";
	import PlusesFines from "./PlusesFines/PlusesFines.vue";

	const route = useRoute();

	let activeTab = ref({
		type: null,
		tab: "po-sts",
	});
	provide("activeTab", activeTab);

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
	]);
</script>
