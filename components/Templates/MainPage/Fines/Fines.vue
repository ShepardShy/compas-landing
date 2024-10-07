<template>
	<AppSection class="main-page section_without-background">
		<AppH1 class="main-page__title"> Быстрая регистрация на портале </AppH1>
		<form class="main-page__form">
			<AppH1 class="main-page__form-title"> Быстрая регистрация на портале </AppH1>
			<div
				class="auth__error"
				v-show="userStore.authError.status"
			>
				{{ userStore.authError.text }}
			</div>

			<div class="main-page__input-wrapper">
				<AppInput
					:disabled="userStore.regButtonLoad"
					class="main-page__input main-page__input_substr"
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

			<div class="main-page__input-wrapper">
				<AppInput
					class="main-page__input"
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

			<div class="main-page__input-wrapper">
				<AppInput
					class="main-page__input"
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
			<div class="main-page__input-wrapper">
				<AppInput
					class="main-page__input"
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
				class="main-page__checkbox main-page__checkbox_long"
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
				class="main-page__button button_blue"
				@click="registration"
			>
				Регистрация
			</AppButton>
		</form>

		<figure class="ibg main-page__image">
			<img
				:src="previewImage[route.params?.type] ? previewImage[route.params?.type] : defaultImage"
				alt="Проверьте штрафы и зарегистрируйтесь в 1 клик"
			/>
		</figure>

		<FinesWarning @callAction="data => saveChanges()" />
	</AppSection>
</template>

<script setup>
	import _ from "lodash";
	import FinesWarning from "./Warning/Warning.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH1 from "@/components/AppHeaders/H1/H1.vue";
	import AppInput from "@/components/AppInputs/Input/Input.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";
	import FansyBox from "@/components/AppFansyBox/FansyBox.vue";
	import ValidateField from "@/components/AppTable/Validate.js";
	import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue";
	import api from "@/helpers/api.js";
	import { useCommonStore } from "@/stores/commonStore.js";
	import { storeToRefs } from "pinia";

	// Картинки проверки штрафов
	import vuImage from "/main/fines/preview-vu.png";
	import stsImage from "/main/fines/preview-sts.png";
	import gosImage from "/main/fines/preview-gos.png";
	import postanovlenieImage from "/main/fines/preview-postanovlenie.png";
	import innImage from "/main/fines/preview-inn.png";
	import defaultImage from "/main/fines/main-preview.png";

	import { useUserStore } from "@/stores/userStore.js";
	const userStore = useUserStore();

	const route = useRoute();

	const { regData } = storeToRefs(userStore);

	const checkboxLink = `<div class="main-page__text">
	       Я понимаю и принимаю <a href="/docs/politics" class="main-page__link" target="_blank"> условия и политику конфиденциальности </a> Compas
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

	const commonStore = useCommonStore();

	const previewImage = {
		"po-sts": stsImage,
		"po-voditelskomu-udostovereniyu": vuImage,
		"po-nomeru-postanovleniya": postanovlenieImage,
		"po-nomeru-avto": gosImage,
		"po-inn": innImage,
	};

	const titleMap = {
		"po-sts": "по СТС",
		"po-voditelskomu-udostovereniyu": "по водительскому удостоверению",
		"po-nomeru-postanovleniya": "по номеру постановления",
		"po-nomeru-avto": "по гос. номеру",
		"po-inn": "по ИНН",
	};

	let fields = computed(() => {
		switch (route.params.type) {
			case "po-sts": {
				return [
					{
						title: "Номер СТС",
						key: "sts",
						name: "sts_number",
						type: "text",
						mask: "## XX ######",
						value: "",
						required: true,
						placeholder: "00 AA 000000",
						class: "input_line",
					},
				];
			}
			case "po-voditelskomu-udostovereniyu": {
				return [
					{
						title: "Номер ВУ",
						key: "vu",
						name: "driver_license",
						type: "text",
						mask: "## ## ######",
						value: "",
						required: true,
						placeholder: "00 00 000000",
						class: "input_line",
					},
				];
			}
			case "po-nomeru-postanovleniya": {
				return [
					{
						title: "Номер постановления",
						key: "uin",
						name: "num_post",
						type: "number",
						mask: "####################",
						value: "",
						required: true,
						placeholder: "00000000000000000000",
						class: "input_line",
					},
				];
			}
			case "po-nomeru-avto": {
				return [
					{
						title: "Гос. номер автомобиля",
						key: "gos",
						name: "number",
						type: "text",
						mask: "A ### AA ###",
						value: "",
						required: true,
						placeholder: "A 000 AA 777",
						class: "input_line",
					},
					{
						title: "Номер СТС",
						key: "sts",
						name: "sts_number",
						type: "text",
						mask: "## XX ######",
						value: "",
						required: true,
						placeholder: "00 AA 000000",
						class: "input_line",
					},
				];
			}
			case "po-inn": {
				return [
					{
						title: "ИНН компании",
						key: "inn",
						name: "inn",
						type: "text",
						mask: "############",
						value: "",
						required: true,
						placeholder: "000000000000",
						class: "input_line",
					},
					{
						title: "КПП компании",
						key: "kpp",
						name: "kpp",
						type: "text",
						mask: "#########",
						value: "",
						required: true,
						placeholder: "000000000000",
						class: "input_line",
					},
				];
			}
			default: {
				return [
					{
						title: "Гос. номер автомобиля",
						key: "number",
						name: "number",
						type: "text",
						mask: "A ### AA ###",
						value: "",
						required: true,
						placeholder: "A 000 AA 777",
						class: "input_line",
					},
					{
						title: "Номер СТС",
						key: "certificate",
						name: "sts_number",
						type: "text",
						mask: "## XX ######",
						value: "",
						required: true,
						placeholder: "00 AA 000000",
						class: "input_line",
					},
				];
			}
		}
	});

	let form = ref([]);
	watchEffect(() => {
		form.value = [
			...fields.value,
			// {
			// 	title: "Электронная почта для входа",
			// 	key: "email",
			// 	name: "email",
			// 	type: "email",
			// 	mask: null,
			// 	value: "",
			// 	required: true,
			// 	placeholder: "mail@compas.pro",
			// 	class: "input_line",
			// },
			// {
			// 	title: "Пароль для входа",
			// 	key: "password",
			// 	name: "password",
			// 	type: "password",
			// 	mask: null,
			// 	value: "",
			// 	required: true,
			// 	placeholder: null,
			// 	class: "input_line",
			// },
			// {
			// 	title: "Повторить пароль для входа",
			// 	key: "repeatPassword",
			// 	name: "password_confirmation",
			// 	type: "password",
			// 	mask: null,
			// 	value: "",
			// 	required: true,
			// 	placeholder: null,
			// 	class: "input_line",
			// },
		];
	});

	const formData = computed(() => {
		const data = {};
		for (let item of form.value) {
			const trimmedValue = item.value.replace(/\s+/g, "");
			data[item.name] = trimmedValue;
		}
		return data;
	});

	let invalidFields = ref([]);
	let isShow = ref(false);
	const isLoading = ref(false);

	// const changeValue = data => {
	// 	let findIndex = form.value.findIndex(p => p.key == data.key);
	// 	form.value[findIndex].value = data.value;
	// };

	// Сохранение редактируемых полей
	const saveChanges = () => {
		// Инициализация сохранения строк
		const initSave = async () => {
			if (invalidFields.value.length > 0) {
				isShow.value = {
					state: true,
					type: "validation",
				};
			} else {
				isShow.value = {
					state: false,
					type: null,
				};
				isLoading.value = true;

				try {
					const { domain, success, token, url } = await api.callMethod("POST", `registration`, { ...formData.value, tariff: 1 });

					if (success) {
						const isInside = commonStore.accounts.find(i => i.toLowerCase() == domain.toLowerCase());
						!isInside && commonStore.accounts.push(domain.toLowerCase());
						navigateTo(`https://${domain}.compas.pro${url ? url : ""}/?token=${token}`, { external: true });
						for (let elem of form.value) {
							elem.value = "";
						}
					}
				} catch (error) {
				} finally {
					isLoading.value = false;
				}
			}
		};

		// Проверка полей на валидацию
		const checkingFields = () => {
			// Валидация полей
			const validateField = field => {
				let error = ValidateField(field, field.value);

				if (error.state) {
					return error.text;
				} else {
					return false;
				}
			};

			for (let field of form.value) {
				let error = validateField(field);
				if (error) {
					invalidFields.value.push({
						field: field,
						error: error,
					});
				} else {
					let repeatPassword = form.value.find(p => p.key == "repeatPassword");
					let password = form.value.find(p => p.key == "password");
					if ((field.type == "password" || field.type == "repeatPassword") && password.value != repeatPassword.value) {
						invalidFields.value.push({
							field: field,
							error: "Пароли должны совпадать",
						});
					}
				}
			}
		};

		invalidFields.value = [];
		checkingFields();
		initSave();
	};

	provide("form", form);
	provide("isShow", isShow);
	provide("invalidFields", invalidFields);
</script>

<style>
	@import url(./Fines.scss);
</style>
