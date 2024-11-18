<template>
	<AppSection class="main__tariffs section_without-background">
		<AppH2> Тарифы </AppH2>
		<TariffsSlider />
	</AppSection>
</template>

<script setup>
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import TariffsSlider from "@/components/Templates/Common/TariffsSlider/TariffsSlider.vue";
</script>

<style>
	@import url(./Tariffs.scss);
</style>
