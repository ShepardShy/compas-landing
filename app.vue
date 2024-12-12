<template>
	<NuxtLoadingIndicator
		v-if="!route.fullPath.includes('/auth')"
		color="#de7403"
	/>
	<div class="wrapper">
		<div
			class="page"
			:class="{ page_auth: route.path == '/auth', error: route.path == '/404' || route.path == '/403' }"
		>
			<AppMenu
				v-if="!route.fullPath.includes('/auth')"
				:isShowMobile="false"
			/>
			<AppMain>
				<NuxtPage />
			</AppMain>
			<MobileApp v-if="!route.fullPath.includes('/auth')" />
			<AppFooter v-if="!route.fullPath.includes('/auth')" />
		</div>
	</div>
</template>

<script setup>
	import AppMenu from "@/components/AppMenu/AppMenu.vue";
	import AppFooter from "@/components/AppFooter/Footer.vue";
	import MobileApp from "@/components/Templates/Common/MobileApp/MobileApp.vue";
	import { useGlobalStore } from "~/stores/globalStore";

	const globalStore = useGlobalStore();
	await globalStore.loadLastModified();

	let route = useRoute();
</script>
