<template>
	<div class="wrap">
		<img
			v-if="image"
			:src="image"
			alt="image"
			class="wrap__image"
		/>
		<div
			v-html="parseOrDecodeHtml(text)"
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

	// Функция для проверки валидности HTML
	const isValidHtml = html => {
		// Дополнительная проверка на наличие закодированных сущностей
		if (html.includes("&lt;") || html.includes("&gt;")) {
			return false;
		}

		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		// Проверка на наличие ошибок парсинга
		return !doc.querySelector("parsererror");
	};

	// Функция для декодирования HTML сущностей
	const decodeHtml = html => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		return doc.documentElement.textContent;
	};

	// Функция для проверки валидности HTML или декодирования
	const parseOrDecodeHtml = html => {
		console.log(isValidHtml(html), "isValidHtml");
		console.log(html);

		return isValidHtml(html) ? html : decodeHtml(html);
	};
</script>

<style>
	@import url(./WrapText.scss);
</style>
