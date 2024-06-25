<template>
	<div class="wrapper">
		<div
			class="page"
			:class="route.path == '/auth' ? 'page_auth' : ''"
		>
			<AppMenu :is-show-mobile="store.isShowMobileMenu" />
			<AppMain>
				<NuxtPage />
			</AppMain>
			<AppFooter />
		</div>
	</div>
</template>

<script setup>
	import AppMenu from "@/components/AppMenu/AppMenu.vue";
	import AppFooter from "@/components/AppFooter/Footer.vue";
	import { useCommonStore } from "~/stores/commonStore";

	const store = useCommonStore();

	let route = useRoute();
</script>
