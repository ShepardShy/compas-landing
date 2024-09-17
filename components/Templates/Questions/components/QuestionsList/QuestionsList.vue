<template>
	<div class="questions__list">
		<QuestionItem
			:date="created_at"
			:title="preview_text"
			:answer="detail_text[0]?.body"
			:image="detail_picture?.[0].file"
			:views
			:id="slug?.value"
			v-for="{ created_at, slug, detail_picture, detail_text, preview_text, views } in questions"
		/>
	</div>
	<AppPagination
		:totalPages
		v-model="activePage"
		class="questions__list-pagination"
	/>
</template>

<script setup>
	import QuestionItem from "@/components/Templates/Common/QuestionItem/QuestionItem.vue";
	import AppPagination from "~/components/AppPagination/AppPagination.vue";

	const props = defineProps({
		questions: { type: Array, required: true },
	});

	const totalPages = ref(66);
	const activePage = ref(1);
</script>

<style>
	@import url("./QuestionsList.scss");
</style>
