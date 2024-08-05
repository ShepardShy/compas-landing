<template>
	<div class="pagination-full">
		<ShowMore />

		<div class="pagination-full__wrapper">
			<Pagination
				:totalPages="totalPages"
				:activePage="activePage"
				@callAction="changePage"
			/>
			<AppSelect
				class="pagination-full__select"
				:item="{
					id: 0,
					key: 'visibleElems',
					value: activeOnPage,
					focus: false,
					required: false,
					title: 'На странице:',
					lockedOptions: [],
					options: [
						{
							label: '25',
							value: 25,
						},
						{
							label: '50',
							value: 50,
						},
						{
							label: '100',
							value: 100,
						},
					],
				}"
				:isFiltered="false"
				:isHaveNullOption="false"
				@changeValue="changeOnPage"
			/>
		</div>
	</div>
</template>

<script setup>
	import ShowMore from "./components/ShowMore/ShowMore.vue";
	import Pagination from "./components/Pagination/Pagination.vue";
	import AppSelect from "@/components/AppSelects/Select/Select.vue";

	const props = defineProps({
		totalPages: {
			type: Number,
			required: true,
		},
	});
	const { totalPages } = toRefs(props);
	const activePage = defineModel();

	// Опции "На странице"
	const activeOnPage = ref(25);

	// Выбор текущей страницы
	const changePage = data => {
		activePage.value = data.value;
	};
</script>

<style lang="scss">
	@import url(./AppPagination.scss);
</style>
