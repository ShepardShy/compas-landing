<template>
	<div class="wrap">
		<img
			v-if="image"
			:src="image"
			alt="image"
			class="wrap__image"
		/>
		<div
			ref="$text"
			class="wrap__text"
		></div>
	</div>
</template>

<script setup>
	const props = defineProps({
		text: { type: String },
		image: { type: String },
	});
	const { image, text } = toRefs(props);

	const $text = ref(null);

	onMounted(() => {
		console.log($text.value);

		// Вставляем HTML контент
		if ($text.value) {
			$text.value.innerHTML = text.value;

			// Ищем все элементы <table>
			const tables = $text.value.querySelectorAll("table");
			tables.forEach(table => {
				// Создаем div с классом "table__wrapper"
				const wrapper = document.createElement("div");
				wrapper.classList.add("table__wrapper");

				// Создаем div с классом "table-swipe"
				const swipeWrapper = document.createElement("div");
				swipeWrapper.classList.add("table-swipe");

				// Создаем div с классом "table"
				const tableWrapper = document.createElement("div");
				tableWrapper.classList.add("table");

				// Вставляем таблицу в table-wrapper
				table.parentNode.insertBefore(wrapper, table); // Вставляем wrapper перед таблицей
				tableWrapper.appendChild(table); // Вставляем таблицу внутрь div.table

				// Вставляем table-swipe и table внутрь table__wrapper
				wrapper.appendChild(swipeWrapper);
				wrapper.appendChild(tableWrapper);
			});
		}
	});
</script>

<style>
	@import url(./WrapText.scss);
</style>
