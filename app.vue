<template>
	<NuxtLoadingIndicator
		v-if="!route.fullPath.includes('/auth')"
		color="#de7403"
	/>
	<div class="wrapper">
		<div
			class="page"
			:class="route.path == '/auth' ? 'page_auth' : ''"
		>
			<AppMenu
				v-if="!route.fullPath.includes('/auth')"
				:isShowMobile="false"
			/>
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
