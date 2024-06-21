<template>
	<details
		class="popup"
		ref="popupRef"
		:style="`--popupHeight: ${popupHeight}px`"
		:class="props.isReadOnly ? 'popup_readonly' : ''"
		@mouseup="event => (mouseDownEvent = null)"
		@mousedown="event => (mouseDownEvent = event)"
		v-click-out-side="event => clickOutside(event)"
		@keyup.space="event => event.preventDefault()"
	>
		<summary
			class="popup__summary"
			@click="() => showDetail()"
		>
			<slot name="summary"></slot>
		</summary>
		<div
			class="popup__content"
			@click="() => (props.closeByClick ? PopupScripts.hideDetails(popupRef) : '')"
		>
			<slot name="content"></slot>
		</div>
	</details>
</template>

<script setup>
	import "./Popup.scss";

	import { ref, onMounted } from "vue";
	import { clickOutSide as vClickOutSide } from "@mahdikhashan/vue3-click-outside";
	import PopupScripts from "./Scripts.js";

	const popupRef = ref(null);
	let mouseDownEvent = ref(null);
	let popupHeight = ref(null);

	const props = defineProps({
		closeByClick: {
			default: false,
			type: Boolean,
		},
		isReadOnly: {
			default: false,
			type: Boolean,
		},
		isCanSelect: {
			default: true,
			type: Boolean,
		},
	});

	const emit = defineEmits(["clickOutside", "openPopup"]);

	// Отслеживание вызова клика за пределами компонента
	const clickOutside = event => {
		if (props.isCanSelect) {
			if (mouseDownEvent.value == null || mouseDownEvent.value.target.closest(".popup") == null) {
				emit("clickOutside", event);
				PopupScripts.hideDetails(popupRef.value);
			}
		} else {
			emit("clickOutside", event);
			PopupScripts.hideDetails(popupRef.value);
		}
		mouseDownEvent.value = null;
	};

	// Показать выплывающее меню
	const showDetail = () => {
		PopupScripts.setDropdownPosition(popupRef.value);
		emit("openPopup", popupRef.value);
	};

	const setHeight = () => {
		popupHeight.value = popupRef.value == null ? 40 : popupRef.value.offsetHeight;
	};

	onMounted(() => {
		new ResizeObserver(setHeight).observe(popupRef.value);
	});

	defineExpose({
		popupRef,
	});
</script>
