<template>
	<AppSection class="fines section_without-background">
		<AppH1 class="fines__title"
			>Калькулятор ОСАГО. <br />
			<span style="color: #929292">Оформите ОСАГО на лучших условиях и оформить полис онлайн.</span>
		</AppH1>
		<form
			class="fines__form"
			@click.prevent
		>
			<AppH1 class="fines__form-title">
				Калькулятор ОСАГО. <br />
				<span style="color: #929292">Оформите ОСАГО на лучших условиях и оформить полис онлайн.</span>
			</AppH1>
			<AppInput
				v-for="item in form"
				:class="item.class"
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
				@changeValue="(data) => changeValue(data)"
			/>
			<div class="fines__check">
				<div class="fines__politics"><span style="color: #000">Нет гос. номера</span> (Если у вас ещё нет номера или вы планируете его сменить, продолжайте оформление без него)</div>
				<AppCheckbox
					class="fines__checkbox"
					style="width: 100%"
					:item="{
						id: 2,
						title: checkboxLink,
						value: confidence.value,
						placeholder: '',
						type: 'checkbox',
						key: 'confidence',
						isHTML: true,
					}"
					:disabled="userStore.regButtonLoad"
					:isTextClickable="false"
					@changeValue="(data) => changeValue(data)"
				/>
			</div>

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
		</form>

		<figure class="ibg fines__image">
			<img
				src="/main/fines/main-preview.png"
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
	import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue";
	import api from "@/helpers/api.js";
	import { useFinesStore } from "~/stores/finesStore.js";
	import { useUserStore } from "@/stores/userStore.js";

	const finesStore = useFinesStore();
	const route = useRoute();

	const userStore = useUserStore();

	const checkboxLink = `<div class="main-page__text">
	   Для постановки авто на учёт в ГАИ подойдёт распечатанный полис даже без вписанного номера. Номер можно будет вписать в полис после постановки авто на учёт или при следующем продлении ОСАГО
	  </div>`;

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

	let fields = computed(() => {
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
		];
	});

	let form = ref([]);
	let confidence = ref({ key: "confidence", name: "confidence", value: false });
	form.value = [...fields.value];

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

	const changeValue = ({ key, value }) => {
		if (key != "confidence") {
			form.value.find((i) => i.key == key).value = value;
			return;
		}
		confidence.value.value = value;
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
