<template>
	<div class="wrap">
		<img
			v-if="image"
			:src="image"
			alt="image"
			class="wrap__image"
		/>
		<FansyBox>
			<div
				ref="$text"
				class="wrap__text"
			></div>
		</FansyBox>
	</div>
</template>

<script setup>
	import FansyBox from "@/components/AppFansyBox/FansyBox.vue";

	const props = defineProps({
		text: { type: String },
		image: { type: String },
	});
	const { image, text } = toRefs(props);

	const $text = ref(null);

	onMounted(() => {
		// Вставляем HTML контент
		if ($text.value) {
			$text.value.innerHTML = text.value;

			// Ищем все элементы <table>
			const tables = $text.value.querySelectorAll("table");
			tables.forEach((table) => {
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

			// Add data-fancybox="gallery" to all img elements in .wrap__text
			const images = $text.value.querySelectorAll("img");
			images.forEach((img) => {
				img.setAttribute("data-fancybox", "gallery");
			});

			// Group <h3> and elements after it into a single div
			const headings = Array.from($text.value.querySelectorAll("h3"));
			headings.forEach((h3) => {
				const groupWrapper = document.createElement("div");
				groupWrapper.classList.add("subtitle-wrapper");

				// Перемещаем сам h3 в group-wrapper
				h3.parentNode.insertBefore(groupWrapper, h3);
				groupWrapper.appendChild(h3);

				// Перемещаем все следующие элементы до следующего h3
				let nextSibling = groupWrapper.nextSibling;
				while (nextSibling && nextSibling.nodeName !== "H3") {
					const currentSibling = nextSibling;
					nextSibling = nextSibling.nextSibling;

					if (currentSibling.nodeType === Node.ELEMENT_NODE || (currentSibling.nodeType === Node.TEXT_NODE && currentSibling.textContent.trim())) {
						groupWrapper.appendChild(currentSibling);
					}
				}
			});
		}
	});
</script>

<style>
	@import url(./WrapText.scss);
</style>
