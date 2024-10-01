<template>
	<undefinedPage />
</template>

<script setup>
	import undefinedPage from "@/components/Templates/ErrorPage/404/404.vue";

	onMounted(() => {
		document.body.classList.add("error");
	});
	onUnmounted(() => {
		document.body.classList.remove("error");
	});
</script>
