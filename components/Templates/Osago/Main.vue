<template>
	<AppBreadcrambs :breadcrumbs="breadcrumbs" />
	<MainFines />
	<MainArticles
		category="strahovye-polisy"
		class="main__questinos"
	/>
	<CommonSocial class="main__social" />
</template>

<script setup>
	import "./Main.scss";

	import MainFines from "./Fines/Fines.vue";
	import MainArticles from "~/components/Templates/Common/ArticlesBlock/ArticlesBlock.vue";
	import CommonSocial from "@/components/Templates/Common/Social/Social.vue";

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
		{
			title: "Калькулятор ОСАГО",
			link: "/products/osago",
		},
	]);
</script>
