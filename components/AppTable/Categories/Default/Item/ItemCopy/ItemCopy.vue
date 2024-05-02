<template>
    <CategoryItem 
        :item="props.item"
        :index="props.index"
        :parent_id="props.item.id"
        @callAction="data => emit('callAction', data)"
    />
</template>

<script setup>
    import './ItemCopy.scss';

    import CategoryItem from "../Item.vue";

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
        }
    })

    const emit = defineEmits([
        'callAction'
    ])
</script>
