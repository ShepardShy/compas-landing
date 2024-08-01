<template>
	<div
		class="pagination__item"
		@click="() => changePage(props.item)"
	>
		{{ item }}
	</div>
</template>

<script setup>
	import "./PaginationItem.scss";

	import { inject } from "vue";

	// const footerData = inject('footerData')

	const props = defineProps({
		item: {
			default: 1,
		},
		activePage: {
			default: -1,
			type: Number,
		},
	});

	const emit = defineEmits(["callAction"]);

	// Смена страницы
	const changePage = item => {
		if (item != props.activePage) {
			// footerData.value.activePage = item
			emit("callAction", {
				action: "changePage",
				value: item,
			});
		}
	};
</script>
