<template>
	<FormItem
		class="form-item__autocomplete autocomplete"
		:required="props.item.required"
		:class="[null, undefined].includes(props.item.value) || props.item.value == '' ? 'autocomplete_empty' : ''"
	>
		<FormLabel
			v-if="isShowLabel"
			v-show="props.item.title != null && props.item.title != ''"
			:title="props.item.title"
		/>

		<AppPopup
			ref="popupRef"
			class="autocomplete__popup"
			:class="{ autocomplete__popup_countDistance: props.isCountDistance }"
			:isHaveParent="true"
			:closeByClick="false"
			:isReadOnly="props.isReadOnly"
			:isCanSelect="true"
			@clickOutside="() => emit('clickOutside', true)"
			@click.prevent="() => !props.isCountDistance && preventClick()"
		>
			<template #summary>
				<slot name="icon"></slot>
				<AppInput
					class="autocomplete__input"
					@click.prevent="() => props.isCountDistance && preventClick()"
					:class="{ autocomplete__input: props.isCountDistance }"
					:item="{
						id: props.item.id,
						title: null,
						type: 'text',
						focus: false,
						key: props.item.key,
						placeholder: null,
						value: props.isReadOnly ? (activeOption.text == 'Не выбрано' && props.item.type == 'address' ? null : activeOption.text) : search,
						substring: props.isReadOnly ? null : activeOption.id == null ? ' ' : `ID: ${activeOption.id}`,
					}"
					:mask="null"
					:disabled="false"
					:isLink="props.isLink"
					:isReadOnly="props.isReadOnly"
					:enabledAutocomplete="false"
					:isShowSubstring="props.isShowSubstring"
					@openLink="item => emit('openLink', item)"
					@changeValue="data => callAction({ action: 'searchOptions', value: data.value })"
					@mousedown="event => (props.isReadOnly ? null : event.target.classList.contains('popup_prevent') ? event.preventDefault() : null)"
				>
					<slot name="link"></slot>
					<div
						class="autocomplete__active-option"
						v-show="!props.isReadOnly && ([null, undefined].includes(search) || search == '')"
					>
						{{ activeOption.text }}
					</div>
				</AppInput>
				<AppButton
					v-if="props.isShowButton"
					@click.stop="
						emit('changeValue', {
							key: props.item.key,
							value: activeOption,
						})
					"
					class="autocomplete__button button_blue"
					:style="props.isCountDistance ? { height: '45px' } : ''"
					>Расчитать</AppButton
				>
			</template>
			<template #content>
				<AppLoader
					class="popup__loader"
					v-if="loaderStatus"
				/>
				<PopupOption @click="() => callAction({ action: 'changeValue', value: null })"> Не выбрано </PopupOption>
				<PopupOption
					class="popup-option__root"
					v-for="option in options"
					:class="(option.value == activeOption.id ? 'popup__option_active' : '', ![null, undefined].includes(props.item.lockedOptions) && props.item.lockedOptions.includes(option.value) ? 'popup__option_disabled' : '')"
					@click="() => callAction({ action: 'changeValue', value: option.value })"
				>
					<div class="popup-option__text">
						{{ option.label.text }}
					</div>

					<span
						class="popup-option__substring"
						v-show="props.isShowId"
					>
						ID: {{ option.label.id }}
					</span>
				</PopupOption>
				<PopupOption
					v-if="isCanCreate"
					class="popup__option_create"
					@click.prevent="() => callAction({ action: 'createOption', value: true })"
				>
					Создать
				</PopupOption>
			</template>
		</AppPopup>
	</FormItem>
</template>

<script setup>
	import "./Input.scss";

	import { ref, onMounted, watch, inject } from "vue";

	import _ from "lodash";
	import AppPopup from "@/components/AppPopup/Popup.vue";
	import AppInput from "@/components/AppInputs/Input/Input.vue";
	import FormItem from "@/components/AppForm/FormItem/FormItem.vue";
	import FormLabel from "@/components/AppForm/FormLabel/FormLabel.vue";
	import PopupOption from "@/components/AppPopup/PopupOption/PopupOption.vue";
	import PopupScripts from "@/components/AppPopup/Scripts.js";
	import AppLoader from "@/components/AppLoader/AppLoader.vue";
	import AppButton from "@/components/AppButton/AppButton.vue";

	const props = defineProps({
		item: {
			default: {
				id: 0,
				required: false,
				title: "Autocomlete title",
				value: null,
				placeholder: null,
				focus: false,
				key: null,
				options: [],
				lockedOptions: [],
			},
			type: Object,
		},
		isReadOnly: {
			default: false,
			type: Boolean,
		},
		isCanCreate: {
			default: false,
			type: Boolean,
		},
		isLink: {
			default: false,
			type: Boolean,
		},
		isShowId: {
			default: false,
			type: Boolean,
		},
		anotherTitle: {
			default: null,
			type: String,
		},
		loaderStatus: {
			default: false,
			type: Boolean,
		},
		isShowLabel: {
			default: true,
			type: Boolean,
		},
		placeholder: {
			default: "Не выбрано",
			type: String,
		},
		isShowSubstring: {
			default: true,
			type: Boolean,
		},
		isShowButton: {
			default: false,
			type: Boolean,
		},
		isCountDistance: {
			default: false,
			type: Boolean,
		},
	});

	const popupRef = ref(null);
	const nullOption = {
		id: null,
		sort: 0,
		text: props.placeholder,
	};
	let activeOption = ref(nullOption);
	let search = ref(null);
	let options = ref([]);
	let backupOptions = ref([]);

	const actionState = inject("actionState");

	const emit = defineEmits(["openLink", "changeValue", "createOption", "clickOutside", "searchOptions"]);

	// Превент клика при нажатии на блок
	const preventClick = () => {
		console.log(popupRef.value);
		if (props.isReadOnly || popupRef.value.popupRef.closest(".popup_prevent") != null) {
			popupRef.value.popupRef.removeAttribute("open");
		} else {
			if (popupRef.value.popupRef.closest(".form-item__substring") == null) {
				popupRef.value.popupRef.setAttribute("open", true);
			} else {
				setTimeout(() => {
					if (popupRef.value.popupRef.hasAttribute("open")) {
						popupRef.value.popupRef.removeAttribute("open");
						popupRef.value.popupRef.classList.remove("popup_up");
						popupRef.value.popupRef.classList.remove("popup_visible");
						popupRef.value.popupRef.classList.remove("popup_right");
					} else {
						popupRef.value.popupRef.setAttribute("open", true);
					}
				}, 5);
			}
		}
	};

	// Действия с автокомплитом
	const callAction = data => {
		// Получение опций
		const getOptions = () => {
			// Проверка на пустой объект
			const isEmpty = obj => {
				for (const prop in obj) {
					if (Object.hasOwn(obj, prop)) {
						return false;
					}
				}
				return true;
			};

			let localOptions = props.item.options == null ? [] : props.item.options.filter(p => p != null && typeof p == "object" && !Array.isArray(p) && !isEmpty(p)).sort((prev, next) => prev.label.sort - next.label.sort);
			options.value = JSON.parse(JSON.stringify(localOptions));
		};

		// Создание опции
		const createOption = () => {
			PopupScripts.hideDetails(popupRef.value.popupRef);
			emit("createOption", {
				key: props.item.key,
				value: true,
			});
		};

		// Установка выбранной опции
		const setActiveOption = value => {
			search.value = "";
			if (typeof value == "string") {
				activeOption.value = { ...nullOption, text: value };
			} else if (value === null || !value?.text) {
				activeOption.value = nullOption;
			} else {
				activeOption.value = value;
				search.value = value.text;
			}
			// search.value = "";
			// let findedOption = options.value == null ? null : options.value.find(option => _.isEqual(String(option.value), String(value)));

			// if ([null, undefined].includes(findedOption)) {
			// 	activeOption.value = nullOption;
			// } else {
			// 	activeOption.value = findedOption.label;
			// 	search.value = findedOption.label.text;
			// }
		};

		// Поиск опций
		const searchOptions = value => {
			search.value = value;
			if (!popupRef.value.popupRef.hasAttribute("open")) {
				popupRef.value.popupRef.setAttribute("open", true);
			}
			emit("searchOptions", { key: props.item.key, value: search.value });
		};

		// Изменить значение поля
		const changeValue = value => {
			if (value == null || (![null, undefined].includes(props.item.lockedOptions) && !props.item.lockedOptions.includes(value)) || props.item.type == "address") {
				search.value = null;
				// options.value = backupOptions.value;
				setActiveOption(value);
				setTimeout(() => {
					PopupScripts.hideDetails(popupRef.value.popupRef);
					if (!props.isShowButton) {
						emit("changeValue", {
							key: props.item.key,
							value: value,
						});
					}
					value?.text && callAction({ action: "searchOptions", value: value.text });
				}, 10);
			} else if (value == null) {
				emit("changeValue", null);
			}
		};

		switch (data.action) {
			// Создание опции
			case "createOption":
				createOption();
				break;

			// Установка выбранной опции
			case "setActiveOption":
				setActiveOption(data.value);
				break;

			// Поиск опций
			case "searchOptions":
				searchOptions(data.value);
				break;

			// Изменить значение поля
			case "changeValue":
				changeValue(data.value);
				break;

			// Получение опций
			case "getOptions":
				getOptions();
				break;
			default:
				break;
		}
	};

	onMounted(() => {
		callAction({
			action: "getOptions",
			value: null,
		});
		backupOptions.value = JSON.parse(JSON.stringify(options.value));
		callAction({
			action: "setActiveOption",
			value: props.item.value,
		});

		if (![null, undefined].includes(props.anotherTitle) && typeof props.anotherTitle == "string" && props.anotherTitle != "") {
			search.value = props.anotherTitle == null ? null : props.anotherTitle;
		} else {
			search.value = activeOption.value.id == null ? null : activeOption.value.text;
		}

		if (actionState) {
			watch(
				() => actionState.value,
				() => {
					search.value = props.anotherTitle == null ? null : props.anotherTitle;
				}
			);
		}
	});

	watch(
		() => props.item.options,
		() => {
			callAction({
				action: "getOptions",
				value: null,
			});
		}
	);

	watch(
		() => props.item.value,
		() => {
			callAction({
				action: "getOptions",
				value: null,
			});
			callAction({ action: "searchOptions", value: props.item.value });
			// callAction({
			// 	action: "setActiveOption",
			// 	value: props.item.value,
			// });
		}
	);

	defineExpose({
		popupRef,
	});
</script>
