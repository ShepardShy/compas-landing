<template>
	<div class="question">
		<img
			v-if="image"
			:src="image"
			alt="image"
			class="question__image"
		/>
		<div class="question__body">
			<h1 class="question__title">{{ title }}</h1>
			<p
				ref="questionText"
				class="question__text"
			></p>
			<NuxtLink
				:href="`/questions/${id?.value ?? id}`"
				v-if="isShowMore"
				class="question__more"
				>Подробнее</NuxtLink
			>
			<div class="question__info">
				<p class="question__views views">
					<IconPasswordEye class="header__views-eye" />
					<span>
						{{ views ? views : 0 }}
					</span>
				</p>
				<!-- <div class="header__duration duration">
					Читать вопрос-ответ: <span class="duration_black">{{ readingTime }} мин</span>
				</div> -->
			</div>
		</div>
	</div>
</template>

<script setup>
	import IconPasswordEye from "@/components/AppIcons/PasswordEye/PasswordEye.vue";
	import "dayjs/locale/ru";
	const dayjs = useDayjs();

	const props = defineProps({
		title: { type: String },
		answer: { type: String },
		image: { type: String },
		id: { type: String },
		date: { type: String },
		views: { type: Number },
		isShowMore: { type: Boolean, default: false },
		readingTime: { type: Number },
	});
	const { image, answer, title, isShowMore, date, id, views, readingTime } = toRefs(props);

	const questionText = ref(null);

	onMounted(() => {
		// Вставляем HTML контент
		if (questionText.value) {
			questionText.value.innerHTML = answer.value;

			// Ищем все элементы <table>
			const tables = questionText.value.querySelectorAll("table");
			tables.forEach((table) => {
				// Создаем div с классом "table__wrapper"
				const wrapper = document.createElement("div");
				wrapper.classList.add("table__wrapper");

				// Создаем div с классом "table-swipe"
				const swipeWrapper = document.createElement("div");
				swipeWrapper.classList.add("table-swipe");

				// Создаем div с классом "table"
				const tableWrapper = document.createElement("div");
				tableWrapper.classList.add("table");

				// Вставляем таблицу в table-wrapper
				table.parentNode.insertBefore(wrapper, table); // Вставляем wrapper перед таблицей
				tableWrapper.appendChild(table); // Вставляем таблицу внутрь div.table

				// Вставляем table-swipe и table внутрь table__wrapper
				wrapper.appendChild(swipeWrapper);
				wrapper.appendChild(tableWrapper);
			});
		}
	});
</script>

<style>
	@import url(./QuestionFull.scss);
</style>
