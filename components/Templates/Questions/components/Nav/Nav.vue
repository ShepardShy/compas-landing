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
					<Triangle
						class="nav__item-triangle"
						v-if="category.children"
					/>
				</div>
				<div
					@click="child.value ? (activeNav = child.value) : null"
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
	import categoriesJson from "./composables/categories.json";
	import Triangle from "~/components/AppIcons/Triangle/Triangle.vue";

	let categories = ref(categoriesJson);
	let activeNav = ref("all");
</script>

<style>
	@import url("./Nav.scss");
</style>
