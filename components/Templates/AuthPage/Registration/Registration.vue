<template>
	<AppH1 class="auth__title"> Регистрация портала </AppH1>
	<AppSection class="auth__form">
		<div
			class="auth__error"
			v-show="userStore.authError.status"
		>
			{{ userStore.authError.text }}
		</div>

		<div class="auth__input-wrapper">
			<AppInput
				:disabled="userStore.regButtonLoad"
				class="auth__input auth__input_substr"
				:item="{
					id: 0,
					title: 'Название портала',
					value: regData.domain,
					placeholder: 'Название портала',
					type: 'text',
					key: 'domain',
					substring: '.compas.pro',
				}"
				:mask="null"
				:enabledAutocomplete="true"
				@keyup.enter="!disabledButton ? registration() : null"
				@changeValue="data => changeValue(data)"
			/>
			<p
				v-for="error in regData.domainError"
				v-if="regData.domainError"
				class="warning-list__field-error"
			>
				{{ error }}
			</p>
		</div>

		<div class="auth__input-wrapper">
			<AppInput
				class="auth__input"
				:item="{
					id: 0,
					title: 'E-mail',
					value: regData.email,
					placeholder: 'E-mail',
					type: 'text',
					key: 'email',
				}"
				:required="true"
				:mask="null"
				:disabled="userStore.regButtonLoad"
				:enabledAutocomplete="true"
				@keyup.enter="!disabledButton ? registration() : null"
				@changeValue="data => changeValue(data)"
			/>
			<p
				v-for="error in regData.emailError"
				v-if="regData.emailError"
				class="warning-list__field-error"
			>
				{{ error }}
			</p>
		</div>

		<div class="auth__input-wrapper">
			<AppInput
				class="auth__input"
				:item="{
					id: 1,
					title: 'Пароль',
					value: regData.password,
					placeholder: 'Пароль',
					type: 'password',
					key: 'password',
				}"
				:mask="null"
				:required="true"
				:disabled="userStore.regButtonLoad"
				:enabledAutocomplete="false"
				@keyup.enter="!disabledButton ? registration() : null"
				@changeValue="data => changeValue(data)"
			/>
			<p
				v-for="error in regData.passwordError"
				v-if="regData.passwordError"
				class="warning-list__field-error"
			>
				{{ error }}
			</p>
		</div>
		<div class="auth__input-wrapper">
			<AppInput
				class="auth__input"
				:item="{
					id: 1,
					title: 'Подтверждение пароля',
					value: regData.passwordConfirmation,
					placeholder: 'Подтверждение пароля',
					type: 'password',
					key: 'passwordConfirmation',
				}"
				:mask="null"
				:required="true"
				:disabled="userStore.regButtonLoad"
				:enabledAutocomplete="false"
				@keyup.enter="!disabledButton ? registration() : null"
				@changeValue="data => changeValue(data)"
			/>
			<p
				v-for="error in regData.passwordConfirmationError"
				v-if="regData.passwordConfirmationError"
				class="warning-list__field-error"
			>
				{{ error }}
			</p>
		</div>

		<AppCheckbox
			class="auth__checkbox auth__checkbox_long"
			:item="{
				id: 2,
				title: checkboxLink,
				value: regData.confidence,
				placeholder: '',
				type: 'checkbox',
				key: 'confidence',
				isHTML: true,
			}"
			:disabled="userStore.regButtonLoad"
			@changeValue="data => changeValue(data)"
		/>
		<AppButton
			:disabledOption="disabledButton"
			:class="{ button_loading: userStore.regButtonLoad }"
			class="auth__button button_blue"
			@click="registration"
		>
			Создать портал
		</AppButton>
	</AppSection>
	<div class="auth__text auth__subtext">
		Уже зарегистрированы?
		<span
			class="auth__link"
			@click="() => $emit('changeActiveTab', 'entry')"
		>
			Войти в систему
		</span>
	</div>
</template>

<script setup>
	import "./Registration.scss";
	import { storeToRefs } from "pinia";

	import AppInput from "@/components/AppInputs/Input/Input.vue";
	import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";

	import { useUserStore } from "@/stores/userStore.js";
	const userStore = useUserStore();

	const route = useRoute();

	const { regData } = storeToRefs(userStore);

	const checkboxLink = `<div class="auth__text">
	       Я понимаю и принимаю <a href="/docs/politics" class="auth__link" target="_blank"> условия и политику конфиденциальности </a> Compas
	   </div>`;

	const changeValue = data => {
		regData.value[data.key] = data.value;
	};

	const disabledButton = computed(() => {
		let txt = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return !regData.value.confidence || regData.value.password == "" || regData.value.passwordConfirmation == "" || regData.value.email == "";
	});

	const registration = () => {
		if (route.query.tariff) {
			regData.value.tariff = route.query.tariff;
		}
		if (!userStore.regButtonLoad) {
			userStore.registration(regData.value);
		}
	};
</script>
