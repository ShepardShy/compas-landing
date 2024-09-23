<template>
	<!-- <Input
		class="search"
		placeholder="Поиск по статьям"
	/> -->
	<AppAutocomplete
		class="search"
		ref="autocompleteComponent"
		:item="props.item"
		:isReadOnly="props.isReadOnly"
		:isCanCreate="false"
		:isLink="false"
		:isShowId="false"
		:is-show-label="false"
		:placeholder="props.placeholder"
		:isShowSubstring="false"
		@changeValue="data => changeValue(data)"
		@searchOptions="data => searchOptions(data)"
		@clickButton="data => changeValue(data, 'calculate')"
	/>
</template>

<script setup>
	import AppAutocomplete from "@/components/AppAutocomplete/Input.vue";

	const emits = defineEmits(["changeValue"]);

	const changeValue = data => {
		const search = data.search;
		emits("changeValue", search);
	};

	const searchOptions = data => {
		console.log(data);
	};

	const props = defineProps({
		item: {
			type: Object,
			default: {
				id: 0,
				required: false,
				title: "title",
				value: "",
				type: "address",
				placeholder: "",
				focus: false,
				key: 0,
				options: [],
				lockedOptions: [],
			},
			required: true,
		},
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
</script>

<style scoped>
	@import url(./Search.scss);
</style>
