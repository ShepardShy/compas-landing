<template>
	<div class="tarif">
		<ClientOnly>
			<p
				v-html="contents[route.params?.tab]"
				class="tarif__text"
			></p>
		</ClientOnly>
	</div>
</template>

<script setup>
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import contents from "../../composables/content.json";

	const route = useRoute();
</script>

<style lang="scss">
	@import url(./Tarif.scss);
</style>
