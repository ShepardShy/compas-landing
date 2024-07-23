<template>
	<nav class="nav">
		<div class="nav__header">Вопрос-ответ</div>
		<div class="nav__list">
			<template
				v-for="category in categories"
				:key="category.value"
			>
				<div
					@click="category.value ? (activeNav = category.value) : category.children ? (category.isOpen = !category.isOpen) : ''"
					class="nav__item"
					:class="{ nav__item_active: category.value == activeNav, nav__item_main: category.isMain }"
				>
					{{ category.title }}
				</div>
				<div
					v-if="category.isOpen"
					v-for="child in category.children"
					:key="child.value"
					class="nav__item nav__item_child"
				>
					{{ child.title }}
				</div>
			</template>
		</div>
	</nav>
</template>

<script setup>
	import categoriesJson from "./composables/categories.json";

	let categories = ref(categoriesJson);
	let activeNav = ref("all");
</script>

<style>
	@import url("./Nav.scss");
</style>
