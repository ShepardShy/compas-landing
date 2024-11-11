<template>
	<AuthPage v-if="!(route.params?.tab == 'accounts' && accounts.length <= 0)" />
</template>

<script setup>
	import './Auth.scss'

	import AuthPage from "~/components/Templates/AuthPage/AuthPage.vue";

	import { useCommonStore } from "@/stores/commonStore.js";
	import { storeToRefs } from "pinia";
	const commonStore = useCommonStore();
	const { accounts } = storeToRefs(commonStore);


	const config = useRuntimeConfig();
	const route = useRoute()
	const canonicalUrl = ref(null)
	
	onMounted(() => {
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

		canonicalUrl.value = `${config.public.baseURL}${route.path.replace('/landing', '')}`;

		// Мета теги
		useHead({
			link: [
				{
					rel: 'canonical',
					href: canonicalUrl.value,
				},
			],
		});
	})


	// Мета теги
	useHead({
		title: "Авторизация | Compas.pro",
		meta: [
			{
				name: "description",
				content: "Описание.",
			},
		]
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
