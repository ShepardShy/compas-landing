<template>
	<CategoriesDefault 
		v-if="categoryType == 'default'"
		:activeCategory="props.activeCategory"
	/>
	<CategoriesRoles 
		:activeCategory="props.activeCategory"
		v-else-if="categoryType == 'roles'"
	/>
</template>

<script setup>
    import './Categories.scss';

	import CategoriesDefault from './Default/Default.vue'
	import CategoriesRoles from './Roles/Roles.vue'

	const props = defineProps({
		categoryType: {
			default: 'default',
			type: String
		},
		activeCategory: {
			default: null,
			type: String
		}
	})
</script>
