<template>
	<AppSection class="fines section_without-background">
		<AppH1 class="fines__title"> Проверка штрафов ГИБДД {{ titleMap[route.params.type] }} в 1 клик </AppH1>
		<form
			class="fines__form"
			@click.prevent
		>
			<AppH1 class="fines__form-title"> Проверка штрафов ГИБДД {{ titleMap[route.params.type] }} в 1 клик </AppH1>
			<!-- <Radio /> -->
			<AppInput
				v-for="item in form"
				:class="item.class"
				v-show="
					(form.find((i) => ['sts', 'vu', 'uin', 'gos'].includes(i.key)) && form[0].value != '') ||
					['number', 'certificate', 'sts', 'vu', 'uin', 'gos', 'inn', 'kpp'].includes(item.key) ||
					(form[0].value != '' && form[1].value != '')
				"
				:item="{
					focus: false,
					id: 0,
					placeholder: item.placeholder,
					key: item.key,
					type: item.type,
					title: item.title,
					substring: null,
					required: item.required,
					substring: item.name == 'number' ? setRegNumber() : undefined,
					external_link: null,
					value: item.value,
				}"
				:disabled="isLoading"
				:mask="item.mask"
				:isLink="null"
				:isReadOnly="false"
				:enabledAutocomplete="false"
				@changeValue="(data) => changeValue(data)"
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
						data-src="#video"
						@click="openFancy"
					>
						<div
							id="video"
							class="fines-video__top"
						>
							<iframe
								ref="videoRef"
								width="720"
								height="405"
								:src="`${videoMap[route.params?.type ?? 'default'].link}?getPlayOptions=thumbnail_url`"
								frameBorder="0"
								allow="clipboard-write; autoplay"
								webkitAllowFullScreen
								mozallowfullscreen
								allowFullScreen
							></iframe>
							<div
								v-if="!isVideoStarted"
								@click="startVideo"
								class="fines-video__cover"
							>
								<img
									:src="`https://rutube.ru/api/video/${videoId}/thumbnail/?redirect=1`"
									alt=""
								/>
								<div class="guide__video-play play-video">
									<img
										src="/icons/play-rutube.svg"
										alt=""
									/>
								</div>
							</div>
						</div>

						<figure class="ibg fines__icon">
							<img
								src="/icons/youtube_blue.svg"
								alt="О сервисе"
							/>
						</figure>
						О сервисе
						<span class="button-text"> ({{ videoMap[route.params?.type ?? "default"].duration }}) </span>
					</AppButton>
				</FansyBox>
			</div>
			<div class="fines__politics">Нажимая «Проверить штрафы» вы соглашаетесь с политикой обработки персональных данных и принимаете оферту</div>
		</form>

		<figure class="ibg fines__image">
			<img
				:src="previewImage[route.params?.type] ? previewImage[route.params?.type] : defaultImage"
				alt="Проверьте штрафы и зарегистрируйтесь в 1 клик"
			/>
		</figure>

		<FinesWarning @callAction="(data) => saveChanges()" />
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
	import Radio from "~/components/AppInputs/Radio/Radio.vue";
	import { useCommonStore } from "@/stores/commonStore.js";
	import { useFinesStore } from "~/stores/finesStore.js";

	const finesStore = useFinesStore();

	// Картинки проверки штрафов
	import vuImage from "/main/fines/preview-vu.png";
	import stsImage from "/main/fines/preview-sts.png";
	import gosImage from "/main/fines/preview-gos.png";
	import postanovlenieImage from "/main/fines/preview-postanovlenie.png";
	import innImage from "/main/fines/preview-inn.png";
	import defaultImage from "/main/fines/preview.png";

	const commonStore = useCommonStore();
	const route = useRoute();

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

	const videoMap = {
		"po-sts": {
			link: "https://rutube.ru/play/embed/15f4b3bced1a43b00648295076c493fa/",
			duration: "3 мин 3 сек",
		},
		"po-voditelskomu-udostovereniyu": {
			link: "https://rutube.ru/play/embed/873651c2fbcea2f7936eaa96d4e537f3/",
			duration: "3 мин 1 сек",
		},
		"po-nomeru-postanovleniya": {
			link: "https://rutube.ru/play/embed/6857b8a657ff4ec260b2a6ac2b3c4f6c/",
			duration: "3 мин 1 сек",
		},
		"po-nomeru-avto": {
			link: "https://rutube.ru/play/embed/f60b87d3bdcc566587c317de991e55b7",
			duration: "3 мин 4 сек",
		},
		"po-inn": {
			link: "https://rutube.ru/play/embed/a7264a4686a95aaf930521e381d11611/",
			duration: "3 мин 7 сек",
		},
		default: {
			link: "https://rutube.ru/play/embed/8e8987113cc8cda11efb0b2f2c245f7c/",
			duration: "5 мин 38 сек",
		},
	};

	const setRegNumber = () => {
		return markRaw(defineAsyncComponent(() => import("@/components/AppIcons/regNumbers/rus.vue")));
	};

	const videoLinkArr = videoMap[route.params?.type ?? "default"].link.split("/");
	// id Видео
	let videoId = videoLinkArr[videoLinkArr.length - 1];
	if (videoLinkArr[videoLinkArr.length - 1] == "") {
		videoLinkArr.splice(videoLinkArr.length - 1, 1);
		videoId = videoLinkArr[videoLinkArr.length - 1];
	}

	let timeoutLoadVideo = false;
	const openFancy = () => {
		setTimeout(() => {
			timeoutLoadVideo = true;
		}, 1500);
		const checkIsIframeOpen = (e) => {
			if (!e.target.closest("#video")) {
				document.removeEventListener("pointerdown", checkIsIframeOpen);
				isVideoStarted.value = false;
			}
		};
		document.addEventListener("pointerdown", checkIsIframeOpen);
	};
	const isVideoStarted = ref(false);
	const videoRef = ref(null);

	function play() {
		if (!timeoutLoadVideo) {
			setTimeout(() => {
				var player = videoRef.value;
				player.contentWindow.postMessage(
					JSON.stringify({
						type: "player:play",

						data: {},
					}),
					"*"
				);
			}, 1500);
			return;
		}
		var player = videoRef.value;
		player.contentWindow.postMessage(
			JSON.stringify({
				type: "player:play",

				data: {},
			}),
			"*"
		);
	}

	const startVideo = async () => {
		isVideoStarted.value = true;
		await nextTick();
		play();
	};

	// R###RR###
	let fields = computed(() => {
		switch (route.params.type) {
			case "po-sts": {
				return [
					{
						title: "Номер СТС",
						key: "sts",
						name: "sts_number",
						type: "text",
						mask: "## SS ######",
						value: "",
						required: true,
						placeholder: "00 XX 000000",
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
						type: "text",
						mask: "#########################",
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
						mask: "R ### RR ###",
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
						mask: "## SS ######",
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
						mask: "##########",
						value: "",
						required: true,
						placeholder: "0000000000",
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
						placeholder: "000000000",
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
						mask: "R ### RR ###",
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
						mask: "## SS ######",
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
			// 	title: "E-mail",
			// 	key: "email",
			// 	name: "email",
			// 	type: "text",
			// 	value: "",
			// 	required: true,
			// 	placeholder: "E-mail",
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

	const changeValue = (data) => {
		let findIndex = form.value.findIndex((p) => p.key == data.key);
		form.value[findIndex].value = data.value;
	};

	// Сохранение редактируемых полей
	const saveChanges = async () => {
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
				const res = await api.callMethod("GET", `gibdd/check_by_req?` + new URLSearchParams(formData.value).toString(), { ...formData.value, tariff: 1 });
				console.log(res, "res");

				if (res?.data?.message) {
					isLoading.value = false;
				}

				if (Array.isArray(res)) {
					finesStore.fields = formData.value;
					finesStore.fines = res;
					new Promise((res) => {
						return navigateTo("/products/fines/list");
					}).then(() => {
						isLoading.value = false;
					});
					for (let elem of form.value) {
						elem.value = "";
					}
				}
			}
		};

		// Проверка полей на валидацию
		const checkingFields = async () => {
			// Валидация полей
			const validateField = (field) => {
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
					let repeatPassword = form.value.find((p) => p.key == "repeatPassword");
					let password = form.value.find((p) => p.key == "password");
					if ((field.type == "password" || field.type == "repeatPassword") && password.value != repeatPassword.value) {
						invalidFields.value.push({
							field: field,
							error: "Пароли должны совпадать",
						});
					}
				}
			}
		};

		try {
			invalidFields.value = [];
			await checkingFields();
			await initSave();
		} catch (error) {
			console.log(error);
		} finally {
		}
	};

	provide("form", form);
	provide("isShow", isShow);
	provide("invalidFields", invalidFields);
</script>

<style lang="scss">
	@import url(./Fines.scss);
</style>
