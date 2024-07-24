<template>
	<nav class="nav">
		<div class="nav__header">Вопрос-ответ</div>
		<div class="nav__list">
			<template
				v-for="category in categories"
				:key="category.value"
			>
				<div
					@click="() => (category.value == 'all' ? navigateTo(`/questions`) : navigateTo(`/questions/${category.value}`))"
					class="nav__item"
					:class="{ nav__item_active: category.value == activeNav, nav__item_main: category.isMain }"
				>
					{{ category.title }}
					<Triangle
						@click.stop="category.isOpen = !category.isOpen"
						class="nav__item-triangle"
						v-if="category.children"
					/>
				</div>
				<div
					@click="() => navigateTo(`/questions/${child.value}`)"
					v-if="category.isOpen"
					v-for="child in category.children"
					:key="child.value"
					:class="{ nav__item_active: child.value == activeNav }"
					class="nav__item nav__item_child"
				>
					{{ child.title }}
				</div>
			</template>
		</div>
	</nav>
</template>

<script setup>
	import { storeToRefs } from "pinia";
	import Triangle from "~/components/AppIcons/Triangle/Triangle.vue";
	import { useQuestionsStore } from "~/stores/questionsStore";

	const questionsStore = useQuestionsStore();
	const { categories, activeParent } = storeToRefs(questionsStore);

	// Отрытие списка если у родителя активный ребенок
	onMounted(() => (activeParent.value ? (activeParent.value.isOpen = true) : null));

	const route = useRoute();

	let activeNav = computed(() => (route.params.category ? route.params.category : "all"));
</script>

<style>
	@import url("./Nav.scss");
</style>
