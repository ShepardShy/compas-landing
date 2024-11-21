<template>
	<MenuDesktop
		v-if="props.isShowDesktop"
		@callAction="data => callAction(data)"
	/>
	<!-- <MenuMobile
		v-if="props.isShowMobile"
		v-bind="$attrs"
	/> -->
</template>

<script setup>
	import "./AppMenu.scss";

	import MenuDesktop from "./Desktop/Desktop.vue";
	import MenuMobile from "./Mobile/Mobile.vue";
	import menuItems from "./menu.json";

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

	provide("menu", menuItems);
</script>
