<template>
	<AppAutocomplete
		class="search"
		ref="autocompleteComponent"
		:item="{
			id: 0,
			required: false,
			title: 'title',
			value: '',
			type: 'address',
			placeholder: 'Поиск по вопросам',
			focus: false,
			key: 0,
			options: searchText.length > 0 ? options : [],
			lockedOptions: [],
		}"
		:isReadOnly="props.isReadOnly"
		:isCanCreate="false"
		:isLink="false"
		:isShowId="false"
		:is-show-label="false"
		:placeholder="props.placeholder"
		:isShowSubstring="false"
		:isShowNotSelected="false"
		@changeValue="data => changeValue(data)"
		@searchOptions="data => searchOptions(data)"
		@clickButton="data => changeValue(data, 'calculate')"
	/>
</template>

<script setup>
	import AppAutocomplete from "@/components/AppAutocomplete/Input.vue";

	const emit = defineEmits(["changeValue"]);

	const searchText = ref("");

	const changeValue = data => {
		const value = data.value;
		if (value) {
			emit("changeValue", data);
			return;
		}
		searchText.value = data.search;

		const search = data.search;
		emit("changeValue", search);
	};

	const searchOptions = data => {};

	const props = defineProps({
		value: {
			type: String,
			required: false,
			default: "",
		},
		address: {
			type: String,
			required: false,
			default: "",
		},
		isReadOnly: {
			type: Boolean,
			required: false,
			default: false,
		},
		placeholder: {
			type: String,
			required: false,
			default: "",
		},
		isShowSubstring: {
			type: Boolean,
			required: false,
			default: true,
		},
		isShowInputButton: {
			type: Boolean,
			required: false,
			default: true,
		},
		options: {
			type: Array,
			required: false,
			default: [],
		},
	});
	const { options } = toRefs(props);
</script>

<style scoped>
	@import url(./Search.scss);
</style>
