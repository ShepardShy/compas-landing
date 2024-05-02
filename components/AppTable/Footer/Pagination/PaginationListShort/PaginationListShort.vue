<template>
    <PaginationList class="pagination__list_grid" :style="`--grid-columns-short: ${props.totalPages}`">
        <PaginationItem 
            v-for="item in props.totalPages" 
            :item="item"
            :activePage="props.activePage"
            :class="[item == props.activePage ? 'pagination__item_active' : '', props.totalPages == 1 ? 'pagination__item_alone' : '']"
            @callAction="(data) => $emit('callAction', data)"
        />
    </PaginationList>
</template>

<script setup>
    import './PaginationListShort.scss';
    
    import PaginationList from '../PaginationList/PaginationList.vue';
    import PaginationItem from '../PaginationItem/PaginationItem.vue';

    const props = defineProps({
        activePage: {
            default: 1,
            type: Number
        },
        totalPages: {
            default: 1,
            type: Number
        }
    })
</script>


