<template>
	<NuxtLoadingIndicator />
	<div class="wrapper">
		<div
			class="page"
			:class="route.path == '/auth' ? 'page_auth' : ''"
		>
			<AppMenu :isShowMobile="false" />
			<AppMain>
				<NuxtPage />
			</AppMain>
			<AppFooter v-if="!route.fullPath.includes('/auth')" />
		</div>
	</div>
</template>

<script setup>
	import AppMenu from "@/components/AppMenu/AppMenu.vue";
	import AppFooter from "@/components/AppFooter/Footer.vue";

	let route = useRoute();
</script>
