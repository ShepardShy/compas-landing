<template>
	<div class="radio__wrapper">
		<div
			v-for="option in item.options"
			class="radio__group"
		>
			<input
				ref="inputRef"
				:id="option.value"
				:type="'radio'"
				:value="option.value"
				:name="item.name"
				:disabled="option?.disabled"
				v-model="activeRadio"
			/>
			<label :for="option.value">{{ option.label }}</label>
		</div>
	</div>
</template>

<script setup>
	import "./Field.scss";

	const inputRef = ref();

	const emit = defineEmits(["changeValue"]);

	const props = defineProps({
		item: {
			default: {
				value: "",
				name: "",
				key: "",
				options: [],
			},
			type: Object,
		},
		enabledAutocomplete: {
			default: true,
			type: Boolean,
		},
		disabled: {
			default: false,
			type: Boolean,
		},
	});
	const { item } = toRefs(props);

	const activeRadio = ref(item.value?.value);
	watch(
		() => activeRadio.value,
		() => {
			emit("changeValue", { key: item.value.key, value: activeRadio.value });
		}
	);

	defineExpose({
		inputRef,
	});
</script>
