<template>
	<div class="tarif">
		<p
			v-html="content"
			class="tarif__text"
		></p>
	</div>
</template>

<script setup>
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import contents from "../../composables/content.json";

	const route = useRoute();
	const content = computed(() => contents[route.params?.tab]);
</script>

<style lang="scss" scoped>
	@import url(./Tarif.scss);
</style>
