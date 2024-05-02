<template>
    <div class="table-categories__item" :class="props.item.id == props.activeCategory ? 'table-categories__item_active' : ''" :style="`--itemIndex: ${props.index}`">
        <div class="table-categories__title" :class="props.item.is_admin ? 'table-categories__title_admin' : ''" @click="() => emit('callAction', {action: 'chooseRole', value: props.item.id})">
            {{ props.item.label }}
        </div>

        <ItemDetails 
            v-if="!props.item.is_permanent"
            :item="props.item"
            @callAction="(data) => emit('callAction', data)"
        />
    </div>
</template>


<script setup>
    import './Item.scss';

    import ItemDetails from '../Details/Details.vue'

    const props = defineProps({
        item: {
            default: {
                title: '',
                children: []
            },
            type: Object
        },
        index: {
            default: 0,
            type: Number
        },
        activeCategory: {
            default: null,
            type: String
        }
    })

    const emit = defineEmits([
        'callAction'
    ])
</script>
