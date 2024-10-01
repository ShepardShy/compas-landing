<template>
	<div class="wrapper">
		<div class="page error">
			<AppMenu />
			<AppMain>
				<restrictedPage v-if="error.statusCode === 403 || route.fullPath.split('/').includes('403')" />
				<undefinedPage v-else-if="error.statusCode === 404 || route.fullPath.split('/').includes('404')" />
			</AppMain>
		</div>
	</div>
</template>

<script setup>
	import "./error.scss";
	import "@/assets/default.scss";
	import "@/assets/fonts/fonts.css";
	import "@/assets/global.scss";

	import undefinedPage from "@/components/Templates/ErrorPage/404/404.vue";
	import restrictedPage from "@/components/Templates/ErrorPage/403/403.vue";
	import AppMenu from "@/components/AppMenu/AppMenu.vue";
	import AppMain from "@/components/AppMain/AppMain.vue";
	const error = useError();

	const route = useRoute();

	console.log(route);

	if (route.fullPath != "/404" && route.fullPath != "/403") {
		await navigateTo("/404");
	}

	onMounted(async () => {
		console.log(error);
	});
</script>
