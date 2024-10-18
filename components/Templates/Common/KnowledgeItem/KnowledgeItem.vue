<template>
	<NuxtLink
		@click="navigateTo(`/knowledge/${id}`)"
		class="knowledge__item"
	>
		<div class="knowledge__body">
			<div class="knowledge__title">
				{{ title }}
			</div>
			<div
				v-html="text"
				class="knowledge__subtitle"
			></div>
			<!-- <div class="knowledge__info"> -->
			<div class="knowledge__views views">
				<IconPasswordEye />
				<span>
					{{ views }}
				</span>
			</div>
			<!-- </div> -->
		</div>
	</NuxtLink>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import defaultImgQuestion from "/main/questions/question.jpg";

	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
		},
		image: {
			type: String,
		},
		views: {
			type: Number,
			default: 0,
		},
		date: {
			type: String,
		},
		id: {
			type: String,
		},
	});
	const { title, views, image, text, id } = toRefs(props);
</script>

<style lang="scss" scoped>
	@import url("./KnowledgeItem.scss");
</style>
