<template>
	<AppH1 class="auth__title"> Вход на портал <span class="auth__title-portal__name"></span> </AppH1>
	<AppSection class="auth__form">
		<div class="auth__account-wrapper">
			<p class="auth__account-title">Быстрый вход</p>
			<div
				v-for="account in accounts"
				class="auth__account"
			>
				<span
					class="auth__link"
					@click="navigateTo(`http://${account}.compas.pro/`, { external: true })"
					>{{ `${account}.compas.pro` }}</span
				>
				<AppExit class="auth__account-exit" />
			</div>
		</div>
	</AppSection>
	<div class="auth__text auth__subtext">
		<span
			class="auth__link"
			@click="() => $emit('changeActiveTab', 'entry')"
		>
			Войти в новый портал
		</span>
	</div>
</template>

<script setup>
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
	import AppExit from "@/components/AppIcons/Exit/Exit.vue";

	import { useCommonStore } from "@/stores/commonStore.js";
	import { storeToRefs } from "pinia";
	const commonStore = useCommonStore();
	const { accounts } = storeToRefs(commonStore);

	const deleteAccount = accToDelete => {
		accounts.value = accounts.value.filter(acc => acc != accToDelete);
	};

	watchEffect(() => {
		if (accounts.value.length <= 0) {
			navigateTo("/auth/entry");
		}
	});

	const props = defineProps({
		authRef: {
			default: null,
		},
	});
</script>

<style>
	@import url(./Accounts.scss);
</style>
