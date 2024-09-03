<template>
	<AppSection class="fines section_without-background">
		<AppH1 class="fines__title"> Проверьте штрафы {{ titleMap[route.params.type] }} и зарегистрируйтесь в 1 клик </AppH1>
		<form
			class="fines__form"
			@click.prevent
		>
			<AppInput
				v-for="item in form"
				:class="item.class"
				v-show="(form.find(i => ['sts', 'vu', 'uin', 'gos', 'inn'].includes(i.key)) && form[0].value != '') || ['number', 'certificate', 'sts', 'vu', 'uin', 'gos', 'inn'].includes(item.key) || (form[0].value != '' && form[1].value != '')"
				:item="{
					focus: false,
					id: 0,
					placeholder: item.placeholder,
					key: item.key,
					type: item.type,
					title: item.title,
					substring: null,
					required: item.required,
					external_link: null,
					value: item.value,
				}"
				:disabled="isLoading"
				:mask="item.mask"
				:isLink="null"
				:isReadOnly="false"
				:enabledAutocomplete="false"
				@changeValue="data => changeValue(data)"
			/>
			<div class="fines__actions">
				<AppButton
					class="button_blue"
					@click="saveChanges()"
					:disabled="isLoading"
					:class="{ button_loading: isLoading }"
				>
					Проверить штрафы
				</AppButton>

				<FansyBox class="fines__fansy-box">
					<AppButton
						class="fines__button"
						:data-fancybox="`finesBlock`"
						href=""
					>
						<figure class="ibg fines__icon">
							<img
								src="/icons/youtube_blue.svg"
								alt="О сервисе"
							/>
						</figure>
						О сервисе
						<span class="button-text"> (1 мин 20 сек) </span>
					</AppButton>
				</FansyBox>
			</div>
			<div class="fines__politics">Нажимая «Проверить штрафы» вы соглашаетесь с политикой обработки персональных данных и принимаете оферту</div>
		</form>

		<figure class="ibg fines__image">
			<img
				:src="previewImage[route.params?.type] ? previewImage[route.params?.type] : defaultImage"
				alt="Проверьте штрафы и зарегестрируйтесь в 1 клик"
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
	import api from "@/helpers/api.js";

	import vuImage from "/main/fines/preview-vu.svg";
	import defaultImage from "/main/fines/preview.webp";

	const previewImage = {
		"po-sts": defaultImage,
		"po-voditelskomu-udostovereniyu": vuImage,
		"po-nomeru-postanovleniya": defaultImage,
		"po-nomeru-avto": defaultImage,
		"po-inn": defaultImage,
	};

	const route = useRoute();

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
						mask: "## AA ######",
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
						title: "Номер авто",
						key: "gos",
						name: "number",
						type: "text",
						mask: "A ### AA ###",
						value: "",
						required: true,
						placeholder: "A 000 AA 777",
						class: "input_line",
					},
				];
			}
			case "po-inn": {
				return [
					{
						title: "Номер ИНН",
						key: "inn",
						name: "inn",
						type: "text",
						mask: "############",
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
						title: "Номер автомобиля",
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
						title: "Свидетельство о регистрации ТС",
						key: "certificate",
						name: "sts_number",
						type: "text",
						mask: "## AA ######",
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
			{
				title: "Электронная почта для входа",
				key: "email",
				name: "email",
				type: "email",
				mask: null,
				value: "",
				required: true,
				placeholder: "mail@compas.pro",
				class: "input_line",
			},
			{
				title: "Пароль для входа",
				key: "password",
				name: "password",
				type: "password",
				mask: null,
				value: "",
				required: true,
				placeholder: null,
				class: "input_line",
			},
			{
				title: "Повторить пароль для входа",
				key: "repeatPassword",
				name: "password_confirmation",
				type: "password",
				mask: null,
				value: "",
				required: true,
				placeholder: null,
				class: "input_line",
			},
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

	const changeValue = data => {
		let findIndex = form.value.findIndex(p => p.key == data.key);
		form.value[findIndex].value = data.value;
	};

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

				const { domain, success, token, url } = await api.callMethod("POST", `registration`, { ...formData.value, tariff: 1 });

				if (success) {
					navigateTo(`https://${domain}.compas.pro${url ? url : ""}/?token=${token}`, { external: true });
					for (let elem of form.value) {
						elem.value = "";
					}
				}
				isLoading.value = false;
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
