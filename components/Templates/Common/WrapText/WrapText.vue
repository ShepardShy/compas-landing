<template>
	<div class="wrap">
		<img
			v-if="image"
			:src="image"
			alt="image"
			class="wrap__image"
		/>
		<div
			v-html="decodeHtml(text)"
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

	// Функция для декодирования HTML сущностей
	const decodeHtml = html => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		return doc.documentElement.textContent;
	};
</script>

<style>
	@import url(./WrapText.scss);
</style>
