<template>
	<div class="wrapper">
		<div
			class="page"
			:class="route.path == '/auth' ? 'page_auth' : ''"
		>
			<AppMenu :isShowMobile="store.isShowMobileMenu" />
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
	import { useGlobalStore } from "~/stores/globalStore";

	const store = useGlobalStore();

	let route = useRoute();
</script>
