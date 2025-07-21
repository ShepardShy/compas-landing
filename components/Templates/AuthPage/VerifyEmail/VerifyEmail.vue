<template>
	<AppH1 class="auth__title"> На указанный email {{ userStore.authData.email }}<br> отправлен код для подтверждения </AppH1>
	<AppSection class="auth__form">
		<div class="auth__input-wrapper">
			<AppInput
				class="auth__input auth__input_substr"
				:item="{
					id: 0,
					title: 'Код подтверждения e-mail',
					value: userStore.authData.code,
					placeholder: 'Не заполнено',
					type: 'text',
					key: 'code',
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
			Подтвердить e-mail
		</AppButton>
	</AppSection>
	<div class="auth__text auth__subtext">
		Неверно ввели e-mail,
		<span
			class="auth__link"
			@click="() => $emit('changeActiveTab', 'registration')"
		>
			вернуться к регистрации.
		</span>
	</div>
</template>

<script setup>
	import "./VerifyEmail.scss";

	import AppButton from "@/components/AppButton/AppButton.vue";
import AppH1 from "@/components/AppHeaders/H1/H1.vue";
import AppSection from "@/components/AppSection/AppSection.vue";
import {useCommonStore} from "@/stores/commonStore.js";
import {useUserStore} from "@/stores/userStore.js";
import AppInput from "~/components/AppInputs/Input/Input.vue";
	const commonStore = useCommonStore();
	const userStore = useUserStore();

	const props = defineProps({
		authRef: {
			default: null,
		},
	});

	const changeValue = (data) => {
		userStore.authData[data.key] = data.value;
	};

	const logIn = () => {
		if (!userStore.authButtonLoad) {
			userStore.logIn(userStore.authData, props.authRef);
		}
	};
</script>
