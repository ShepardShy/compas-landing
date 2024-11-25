<template>
	<AppSection class="section_without-background articles-block">
		<AppH2> Статьи которые вас заинтересуют</AppH2>
		<ClientOnly>
			<ArticlesSlider :category="props.category" />
		</ClientOnly>
	</AppSection>
</template>

<script setup>
	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import ArticlesSlider from "@/components/Templates/Common/ArticlesSlider/ArticlesSlider.vue";

	const props = defineProps({
		category: {
			type: String,
		},
	});
	console.log(props.category, "props");
</script>

<style>
	@import url(./ArticlesBlock.scss);
</style>
