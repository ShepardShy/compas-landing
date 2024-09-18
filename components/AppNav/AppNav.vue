<template>
	<nav class="nav">
		<div class="nav__header">{{ title }}</div>
		<div class="nav__list">
			<template
				v-for="category in categories"
				:key="category.value"
			>
				<div
					@click="() => (category.value == 'all' ? navigateTo(`/${path}`) : navigateTo(`/${path}/${category.value}`))"
					class="nav__item"
					:class="{ nav__item_active: category.value == activeNav, nav__item_main: category?.isMain }"
				>
					{{ category.title }}
					<Triangle
						@click.stop="category.isOpen = !category.isOpen"
						class="nav__item-triangle"
						v-if="category.children.length > 0"
					/>
				</div>
				<div
					@click="() => navigateTo(`/${path}/${child.value}`)"
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
	import Triangle from "~/components/AppIcons/Triangle/Triangle.vue";

	const props = defineProps({
		title: { type: String, required: true },
		categories: { type: Array, required: true },
		navParam: { type: String, default: "id" },
		path: { type: String, default: "" },
	});

	const { categories, title, navParam, path } = toRefs(props);

	const activeParent = computed(() => categories.value.find(category => category.children?.some(child => route.fullPath.includes(child.value))));

	// Отрытие списка если у родителя активный ребенок
	onMounted(() => (activeParent.value ? (activeParent.value.isOpen = true) : null));

	const route = useRoute();

	let activeNav = computed(() => (route.params[navParam.value] ? route.params[navParam.value] : "all"));
</script>

<style>
	@import url("./AppNav.scss");
</style>
