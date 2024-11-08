<template>
	<AuthPage v-if="!(route.params?.tab == 'accounts' && accounts.length <= 0)" />
</template>

<script setup>
	import './Auth.scss'

	import AuthPage from "~/components/Templates/AuthPage/AuthPage.vue";

	const route = useRoute();

	import { useCommonStore } from "@/stores/commonStore.js";
	import { storeToRefs } from "pinia";
	const commonStore = useCommonStore();
	const { accounts } = storeToRefs(commonStore);

	onMounted(async () => {
		if (route.params?.tab == "accounts") {
			watch(
				() => accounts.value,
				async () => {
					if (accounts.value.length <= 0) {
						await navigateTo("/auth/entry");
					}
				},
				{ immediate: true }
			);
		}
	});

	// Мета теги
	useHead({
		title: "Авторизация | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		],
		link: [
			{
				rel: "canonical",
				href: `https://compas.pro/auth/${route.params.tab}`,
			},
		],
	});

	onMounted(() => {
		nextTick(() => {
			document.querySelector('.page').classList.add('page_auth')
		})
	})

	onUnmounted(() => {
		document.querySelector('.page').classList.remove('page_auth')
	})
</script>
