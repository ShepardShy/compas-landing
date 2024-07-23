<template>
	<AppSection class="main__questinos section_without-background">
		<AppH2> Часто задаваемые вопросы </AppH2>
		<QuestionsSlider />
	</AppSection>
</template>

<script setup>
	import "./Questions.scss";

	import AppSection from "@/components/AppSection/AppSection.vue";
	import AppH2 from "@/components/AppHeaders/H2/H2.vue";
	import QuestionsSlider from "@/components/Templates/Common/QuestionsSlider/QuestionsSlider.vue";
</script>
