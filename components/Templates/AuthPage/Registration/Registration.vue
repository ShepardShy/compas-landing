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
				class="auth__input auth__input_substr"
				:item="{
					id: 0,
					title: 'Название портала',
					value: userData.domain,
					placeholder: 'Название портала',
					type: 'text',
					key: 'domain',
					substring: '.compas.pro',
				}"
				:mask="null"
				:disabled="false"
				:enabledAutocomplete="true"
				@changeValue="data => changeValue(data)"
			/>
			<p
				v-if="userData.domainError"
				class="warning-list__field-error"
			>
				{{ userData.domainError }}
			</p>
		</div>

		<div class="auth__input-wrapper">
			<AppInput
				class="auth__input"
				:item="{
					id: 0,
					title: 'E-mail',
					value: userData.email,
					placeholder: 'E-mail',
					type: 'text',
					key: 'email',
				}"
				:required="true"
				:mask="null"
				:disabled="false"
				:enabledAutocomplete="true"
				@changeValue="data => changeValue(data)"
			/>
			<p
				v-if="userData.emailError"
				class="warning-list__field-error"
			>
				{{ userData.emailError }}
			</p>
		</div>

		<div class="auth__input-wrapper">
			<AppInput
				class="auth__input"
				:item="{
					id: 1,
					title: 'Пароль',
					value: userData.password,
					placeholder: 'Пароль',
					type: 'password',
					key: 'password',
				}"
				:mask="null"
				:required="true"
				:disabled="false"
				:enabledAutocomplete="false"
				@changeValue="data => changeValue(data)"
			/>
			<p
				v-if="userData.passwordError"
				class="warning-list__field-error"
			>
				{{ userData.passwordError }}
			</p>
		</div>
		<div class="auth__input-wrapper">
			<AppInput
				class="auth__input"
				:item="{
					id: 1,
					title: 'Подтверждение пароля',
					value: userData.repeatPassword,
					placeholder: 'Подтверждение пароля',
					type: 'password',
					key: 'repeatPassword',
				}"
				:mask="null"
				:required="true"
				:disabled="false"
				:enabledAutocomplete="false"
				@changeValue="data => changeValue(data)"
			/>
			<p
				v-if="userData.repeatPasswordError"
				class="warning-list__field-error"
			>
				{{ userData.repeatPasswordError }}
			</p>
		</div>

		<AppCheckbox
			class="auth__checkbox auth__checkbox_long"
			:item="{
				id: 2,
				title: checkboxLink,
				value: userData.confidence,
				placeholder: '',
				type: 'checkbox',
				key: 'confidence',
				isHTML: true,
			}"
			:disabled="false"
			@changeValue="data => changeValue(data)"
		/>
		<AppButton
			:disabledOption="disabledButton"
			:class="userStore.authButtonLoad ? 'button_loading' : ''"
			class="auth__button button_blue"
			@click="() => registration()"
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

	import AppInput from "@/components/AppInputs/Input/Input.vue";
	import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH1 from "@/components/AppHeaders/H1/MobileMenu/MobileMenu.vue";

	import { useUserStore } from "@/stores/userStore.js";
	const userStore = useUserStore();

	let userData = ref({
		email: "",
		emailError: "",
		password: "",
		passwordError: "",
		repeatPassword: "",
		repeatPasswordError: "",
		domain: "",
		domainError: "",

		confidence: false,
	});

	const checkboxLink = `<div class="auth__text">
	       Я понимаю и принимаю <a href="/docs/politics" class="auth__link" target="_blank"> условия и политику конфиденциальности </a> Compas
	   </div>`;

	const changeValue = data => {
		userData.value[data.key] = data.value;
	};

	const disabledButton = computed(() => {
		let txt = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return !userData.value.confidence || userData.value.password != userData.value.repeatPassword || userData.value.domain == "" || userData.value.password == "" || userData.value.repeatPassword == "" || userData.value.email == "" || !txt.test(userData.value.email);
	});

	const registration = () => {
		if (!userStore.authButtonLoad) {
			userStore.registration(userData.value);
		}
	};
</script>
