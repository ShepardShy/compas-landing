<template>
	<iframe
		width="720"
		height="405"
		:src
		frameBorder="0"
		allow="clipboard-write; autoplay"
		webkitAllowFullScreen
		mozallowfullscreen
		allowFullScreen
	></iframe>
</template>

<script setup>
	const props = defineProps({
		src: {
			type: String,
		},
	});
	const { src } = toRefs(props);
</script>

<style lang="scss" scoped></style>
