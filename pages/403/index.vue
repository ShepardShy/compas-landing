<template>
	<restrictedPage />
</template>

<script setup>
	import restrictedPage from "@/components/Templates/ErrorPage/403/403.vue";

	onMounted(() => {
		document.body.classList.add("error");
	});
	onUnmounted(() => {
		document.body.classList.remove("error");
	});
</script>
