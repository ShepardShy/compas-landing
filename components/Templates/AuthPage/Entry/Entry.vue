<template>
	<AppH1 class="auth__title"> Вход на портал <span class="auth__title-portal__name"></span> </AppH1>
	<AppSection class="auth__form">
		<div
			v-if="accounts?.length > 0"
			class="auth__account-wrapper"
		>
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
				<AppExit
					@click="deleteAccount(account)"
					class="auth__account-exit"
				/>
			</div>
		</div>
		<div class="auth__input-wrapper">
			<AppInput
				class="auth__input auth__input_substr"
				:item="{
					id: 0,
					title: 'Название портала',
					value: userStore.authData.domain,
					placeholder: 'Название портала',
					type: 'text',
					key: 'domain',
					substring: '.compas.pro',
				}"
				:mask="null"
				:disabled="userStore.authButtonLoad"
				:enabledAutocomplete="true"
				@changeValue="(data) => changeValue(data)"
				@keyup.enter="logIn"
			/>
			<p
				v-if="userStore.authError.text"
				class="warning-list__field-error"
			>
				{{ userStore.authError.text }}
			</p>
		</div>

		<AppButton
			:class="userStore.authButtonLoad ? 'button_loading' : ''"
			class="auth__button button_blue"
			@click="logIn"
		>
			Войти
		</AppButton>
	</AppSection>
	<div class="auth__text auth__subtext">
		Нет портала?
		<span
			class="auth__link"
			@click="() => $emit('changeActiveTab', 'registration')"
		>
			Создайте бесплатный.
		</span>
	</div>
</template>

<script setup>
	import "./Entry.scss";

	import AppInput from "~/components/AppInputs/Input/Input.vue";
	import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue";
	import AppExit from "@/components/AppIcons/Exit/Exit.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
	import { useCommonStore } from "@/stores/commonStore.js";
	import { storeToRefs } from "pinia";
	const commonStore = useCommonStore();
	import { useUserStore } from "@/stores/userStore.js";
	const userStore = useUserStore();

	const props = defineProps({
		authRef: {
			default: null,
		},
	});

	const { accounts } = storeToRefs(commonStore);

	const deleteAccount = (accToDelete) => {
		accounts.value = accounts.value.filter((acc) => acc != accToDelete);
	};

	const changeValue = (data) => {
		userStore.authData[data.key] = data.value;
	};

	const logIn = () => {
		if (!userStore.authButtonLoad) {
			userStore.logIn(userStore.authData, props.authRef);
		}
	};
</script>
