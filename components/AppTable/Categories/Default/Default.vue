<template>
	<AppSection :isCanResize="false" class="table__categories table-categories">
		<SectionHeader :title="'Каталог'">
			<ButtonText @click="() => emit('callAction', { action: 'initCreateCategory', item: null })">
				Создать
			</ButtonText>
		</SectionHeader>

		<div class="table-categories__list">
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
    import './Default.scss';

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
