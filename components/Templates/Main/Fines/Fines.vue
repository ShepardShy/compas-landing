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
				v-show="(form.find(i => ['sts', 'vu', 'uin', 'gos', 'inn', 'platon', 'parkovka'].includes(i.key)) && form[0].value != '') || ['number', 'region', 'certificate', 'sts', 'vu', 'uin', 'gos', 'inn', 'platon', 'parkovka'].includes(item.key) || (form[0].value != '' && form[1].value != '' && form[2].value != '')"
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
				:disabled="false"
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
				src="/main/fines/preview.webp"
				alt="Проверьте штрафы и зарегестрируйтесь в 1 клик"
			/>
		</figure>

		<FinesWarning @callAction="data => saveChanges()" />
	</AppSection>
</template>

<script setup>
	import "./Fines.scss";

	import _ from "lodash";
	import FinesWarning from "./Warning/Warning.vue";
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH1 from "@/components/AppHeaders/H1/MobileMenu/MobileMenu.vue";
	import AppInput from "@/components/AppInputs/Input/Input.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";
	import FansyBox from "@/components/AppFansyBox/FansyBox.vue";
	import ValidateField from "@/components/AppTable/Validate.js";

	const route = useRoute();

	const titleMap = {
		"po-sts": "по СТС",
		"po-voditelskomu-udostovereniyu": "по водительскому удостоверению",
		"po-nomeru-postanovleniya": "по номеру постановления",
		"po-nomeru-avto": "по гос. номеру",
		"po-inn": "по ИНН",
		"za-platon": "за платон",
		"za-parkovku": "за неправильную парковку",
	};

	let fields = computed(() => {
		switch (route.params.type) {
			case "po-sts": {
				return [
					{
						title: "Номер СТС",
						key: "sts",
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
						type: "text",
						mask: "############",
						value: "",
						required: true,
						placeholder: "000000000000",
						class: "input_line",
					},
				];
			}
			case "za-platon": {
				return [
					{
						title: "Номер Платона",
						key: "platon",
						type: "text",
						mask: "",
						value: "",
						required: true,
						placeholder: "",
						class: "input_line",
					},
				];
			}
			case "za-parkovku": {
				return [
					{
						title: "Номер Парковки",
						key: "parkovka",
						type: "text",
						mask: "",
						value: "",
						required: true,
						placeholder: "",
						class: "input_line",
					},
				];
			}
			default: {
				return [
					{
						title: "Номер автомобиля",
						key: "number",
						type: "text",
						mask: "A ### AA",
						value: "",
						required: true,
						placeholder: "A 000 AA",
						class: null,
					},
					{
						title: "Регион",
						key: "region",
						type: "text",
						mask: "###",
						value: "",
						required: true,
						placeholder: "000",
						class: null,
					},
					{
						title: "Свидетельство о регистрации ТС",
						key: "certificate",
						type: "text",
						mask: null,
						value: "",
						required: true,
						placeholder: null,
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
				key: "mail",
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
				type: "password",
				mask: null,
				value: "",
				required: true,
				placeholder: null,
				class: "input_line",
			},
		];
	});

	let invalidFields = ref([]);
	let isShow = ref(false);

	const changeValue = data => {
		let findIndex = form.value.findIndex(p => p.key == data.key);
		form.value[findIndex].value = data.value;
	};

	// Сохранение редактируемых полей
	const saveChanges = () => {
		// Инициализация сохранения строк
		const initSave = () => {
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

				alert("Данные отправлены на регшистрацию");
				console.log("form", form.value);
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
