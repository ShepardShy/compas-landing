<template>
    <div class="table-categories__item" :style="`--itemIndex: ${props.index}`" v-if="props.item.children.length == 0">
        <div class="table-categories__title" @click="() => emit('callAction', {action: 'chooseCategory', value: props.item.id})">
            {{ props.item.name }}
        </div>

        <ItemDetails 
            :item="props.item"
            :parent_id="props.parent_id"
            @callAction="(data) => emit('callAction', data)"
        />
    </div>
    <details class="table-categories__details" v-else>
        <summary class="table-categories__header" :style="`--itemIndex: ${props.index}`">
            <div class="table-categories__title" @click="() => emit('callAction', {action: 'chooseCategory', value: props.item.id})">
                <IconTriangle />
                {{ props.item.name }}
            </div>

            <ItemDetails 
                :item="props.item"
                :parent_id="props.parent_id"
                @callAction="(data) => emit('callAction', data)"
            />
        </summary>
        <div class="table-categories__list">
            <CategoryItem 
                v-for="item in props.item.children"
                :item="item"
                :parent_id="props.item.id"
                :index="props.index + 2"
                @callAction="(data) => emit('callAction', data)"
            />
        </div>
    </details>
</template>


<script setup>
    import './Item.scss';
    
    import IconTriangle from '@/components/AppIcons/Triangle/Triangle.vue';

    import ItemDetails from '../Details/Details.vue'
    import CategoryItem from "./ItemCopy/ItemCopy.vue";

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
        parent_id: {
            default: null,
            type: Number
        }
    })

    const emit = defineEmits([
        'callAction'
    ])
</script>
