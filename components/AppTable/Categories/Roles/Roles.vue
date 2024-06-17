<template>
	<AppSection class="table__categories table-categories">
		<SectionHeader :title="'Роли'">
			<ButtonText @click="() => emit('callAction', { action: 'initCreateRole', item: null })">
				Создать
			</ButtonText>
		</SectionHeader>

		<div class="table-categories__list table-categories__list_roles">
			<CategoryItem 
				v-for="item in categories"
				:item="item"
				:index="1"
				:activeCategory="props.activeCategory"
				@callAction="(data) => emit('callAction', data)"
			/>
		</div>
	</AppSection>
</template>

<script setup>
    import './Roles.scss';

	import { inject } from 'vue'

	import AppSection from '@/components/AppSection/AppSection.vue';
	import ButtonText from '@/components/AppButton/ButtonText/ButtonText.vue';
    import SectionHeader from "@/components/AppSection/Header/Header.vue";

	import CategoryItem from './Item/Item.vue'

	const categories = inject('categories')

    const emit = defineEmits([
	    'callAction'
    ])

	const props = defineProps({
		activeCategory: {
			default: null,
			type: String
		}
	})
</script>
