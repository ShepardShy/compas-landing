<template>
	<FormItem class="form-item__radio">
		<FormLabel
			v-show="props.item.title != null && props.item.title != ''"
			:title="props.item.title"
		/>

		<FormValue
			v-if="props.isReadOnly"
			:isHTML="false"
			:isLink="props.isLink"
			:value="props.item.value"
			:link="props.item.external_link"
			:substring="props.item.substring"
			@click="() => (props.isLink ? $emit('openLink', props.item) : '')"
		>
			{{ props.substring }}
		</FormValue>

		<Field
			v-else
			ref="inputRef"
			:item="props.item"
			:disabled="props.disabled"
			@focus="(data) => emit('focus', data)"
			@blur="(data) => emit('blur', data)"
			@changeValue="(data) => emit('changeValue', data)"
		/>
		<slot></slot>
	</FormItem>
</template>

<script setup>
	import "./Radio.scss";
	import Field from "./Field/Field.vue";
	import FormItem from "@/components/AppForm/FormItem/FormItem.vue";
	import FormLabel from "@/components/AppForm/FormLabel/FormLabel.vue";
	import FormValue from "@/components/AppForm/FormValue/FormValue.vue";

	const inputRef = ref(null);

	const props = defineProps({
		item: {
			default: {
				id: 0,
				key: "",
				value: "",
				type: "text",
				focus: false,
				substring: null,
				options: [],
			},
			type: Object,
		},
		disabled: {
			default: false,
			type: Boolean,
		},
		isReadOnly: {
			default: false,
			type: Boolean,
		},
	});

	const emit = defineEmits(["focus", "blur", "changeValue"]);

	defineExpose({
		inputRef,
	});
</script>
