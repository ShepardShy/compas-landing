<template>
	<AppSection class="section_without-background articles-block">
		<AppH2> Статьи которые вас заитнересуют</AppH2>
		<ArticlesSlider />
	</AppSection>
</template>

<script setup>
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import ArticlesSlider from "@/components/Templates/Common/ArticlesSlider/ArticlesSlider.vue";
</script>

<style>
	@import url(./ArticlesBlock.scss);
</style>
