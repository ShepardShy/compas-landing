<template>
	<div class="fines-list">
		<AppH1 class="fines-list__title">Быстрая провека штрафов</AppH1>
		<div class="fines-list__info">
			<div
				v-for="(value, key) in fields"
				class="fines-list__group"
			>
				<p class="fines-list__label">{{ fieldLabelsMap[key] }}</p>
				<p class="fines-list__text">{{ value }}</p>
			</div>
			<div class="fines-list__group">
				<p class="fines-list__label">Создание портала</p>
				<p
					@click="() => setRegistrationState()"
					class="fines-list__text fines-list__text_link"
				>
					Зарегистрируйте портал для постоянного отслеживания машины
				</p>
			</div>
			<template v-if="isShowRegistraion">
				<AppH1 class="main-page__form-title"> Быстрая регистрация на портале </AppH1>
				<form
					class="main-page__form fines-list__form"
					@submit.prevent
				>
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
						:isTextClickable="false"
						@changeValue="data => changeValue(data)"
					/>
					<AppButton
						:disabledOption="disabledButton"
						:class="{ button_loading: userStore.regButtonLoad }"
						class="main-page__button button_blue"
						@click="registration"
					>
						Создать портал
					</AppButton>
				</form>
			</template>

			<AppTable
				class="fines-list__table"
				:isTrash="false"
				:actionType="'views'"
				:slug="'equal'"
				:isPermanentEdit="false"
				:table="table"
				:updateScrollButton="tableRole"
				:isDraggableRow="false"
				:activeCategory="null"
				:categories="[]"
				:pageTableOnly="false"
				:isCanSort="false"
				:isShowSettings="false"
				:isHaveCategories="false"
				:categoryType="'default'"
			/>
		</div>
	</div>
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
	import AppTable from "~/components/AppTable/AppTable.vue";
	import { storeToRefs } from "pinia";
	import { useFinesStore } from "~/stores/finesStore.js";
	import { useUserStore } from "@/stores/userStore.js";
	import { useCommonStore } from "@/stores/commonStore.js";

	import tableKeysJson from "./tableKeys.json";

	const isShowRegistraion = ref(false);

	const route = useRoute();

	const userStore = useUserStore();

	const tableRole = ref(0);

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
			userStore.registration(regData.value, fields.value);
		}
	};

	const setRegistrationState = () => {
		tableRole.value++;
		isShowRegistraion.value = !isShowRegistraion.value;
	};
	const commonStore = useCommonStore();

	const fieldLabelsMap = {
		sts_number: "Свидетельство о регистрации ТС *",
		number: "Номер автомобиля *",
		driver_license: "Номер ВУ *",
		num_post: "Номер постановления *",
		inn: "ИНН компании *",
		kpp: "КПП компании *",
	};

	const finesStore = useFinesStore();
	const { fields, fines } = storeToRefs(finesStore);

	if (fields.value) {
		const res = await api.callMethod("GET", `gibdd/check_by_req?` + new URLSearchParams(fields.value).toString(), {});
		fines.value = res.map((i, idx) => {
			return { ...i, id: idx + 1 };
		});
	} else {
		console.log(fields.value, 123);
		// navigateTo("/products/fines");
	}

	const tableSettings = await api.callMethod("GET", `table/fines`, {});
	console.log(tableSettings, "tableSettings");

	const table = ref({
		tableKeys: tableSettings?.fields,
		tableData: fines.value,

		socketRows: {
			header: [],
			body: [],
		},

		// Сортировка по ключу
		sortItem: {
			key: tableSettings?.sort_field,
			order: tableSettings?.sort_order,
		},

		tableFooter: {
			pages: 1,
			activePage: 1,
			count: 25,
		},

		loaderState: "",
	});
	console.log(table.value.tableData,'table');
	
	onMounted(() => {
		userStore.$patch({
			authData: {
				domain: "",
			},
			regData: {
				email: "",
				emailError: [],
				password: "",
				passwordError: [],
				domain: "",
				tariff: "",
				tariffError: "",
				domainError: [],
				passwordConfirmation: "",
				passwordConfirmationError: [],
				confidence: false,
			},
		});
	});
</script>

<style lang="scss">
	@import url(./FinesList.scss);
</style>
