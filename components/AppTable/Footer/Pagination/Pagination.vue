<template>
    <div class="pagination">
        <div class="pagination__title">
            Страница:
        </div>
        <PaginationListShort 
            v-if="props.totalPages <= 7"
            :activePage="props.activePage"
            :totalPages="props.totalPages"
            @callAction="(data) => $emit('callAction', data)"
        />
        <PaginationListLarge 
            v-else
            :activePage="props.activePage"
            :totalPages="props.totalPages"
            @callAction="(data) => $emit('callAction', data)"
        />
    </div>
</template>


<script setup>
    import './Pagination.scss';
    
    import PaginationListLarge from './PaginationListLarge/PaginationListLarge.vue';
    import PaginationListShort from './PaginationListShort/PaginationListShort.vue';

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
