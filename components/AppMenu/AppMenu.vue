<template>
	<MenuDesktop
		v-if="props.isShowDesktop"
		@callAction="data => callAction(data)"
	/>
	<MenuMobile
		v-if="props.isShowMobile"
		v-bind="$attrs"
	/>
</template>

<script setup>
	import "./AppMenu.scss";

	import MenuDesktop from "./Desktop/Desktop.vue";
	import MenuMobile from "./Mobile/Mobile.vue";

	const props = defineProps({
		isShowDesktop: {
			type: Boolean,
			default: true,
		},
		isShowMobile: {
			type: Boolean,
			default: true,
		},
	});

	const emit = defineEmits(["callAction"]);

	let menu = ref([
		{
			id: 1,
			title: "Главная",
			slug: "main",
			sort: 0,
			tab: "/",
			is_hidden: 1,
			enabled: 1,
			childs: [],
		},
		{
			id: 1,
			title: "Продукты",
			slug: "main",
			sort: 0,
			tab: "products",
			is_hidden: 0,
			enabled: 1,
			childs: [
				{
					id: 1,
					title: "Проверка штрафов",
					slug: "main",
					sort: 0,
					alias: "/fines_gibdd",
					is_hidden: 0,
					enabled: 1,
				},
				{
					id: 1,
					title: "Расчет расстояния",
					slug: "main",
					sort: 0,
					is_hidden: 0,
					enabled: 1,
					childs: [
						{
							id: 1,
							title: "За МКАД",
							slug: "main",
							sort: 0,
							alias: "/distance?tab=mkad",
							is_hidden: 0,
							enabled: 1,
						},
						{
							id: 1,
							title: "За КАД",
							slug: "main",
							sort: 0,
							alias: "/distance?tab=kad",
							is_hidden: 0,
							enabled: 1,
						},
					],
				},
			],
		},
		{
			id: 1,
			title: "Тарифы",
			slug: "main",
			sort: 0,
			tab: "/tariffs",
			is_hidden: 0,
			enabled: 1,
			childs: [],
		},
		{
			id: 1,
			title: "Контакты",
			slug: "auth",
			sort: 0,
			tab: "/contacts",
			is_hidden: 0,
			enabled: 1,
			childs: [],
		},
		{
			id: 1,
			title: "Войти",
			slug: "auth",
			sort: 0,
			tab: "/auth?tab=registration",
			is_hidden: 1,
			enabled: 1,
			childs: [],
		},
	]);

	provide("menu", menu);
</script>
