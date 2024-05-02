<template>
    <PaginationList v-if="props.activePage < 5" class="pagination__list_grid" :style="`--grid-columns-short: 7`">
        <PaginationItem 
            v-for="item in 5" 
            :item="item"
            :activePage="props.activePage"
            @callAction="(data) => emit('callAction', data)"
            :class="item == props.activePage ? 'pagination__item_active' : ''"
        />
        <PaginationItem 
            class="pagination__item_disabled"
            :item="'...'"
            :activePage="props.activePage"
        />
        <PaginationItem 
            :item="props.totalPages"
            :activePage="props.activePage"
            @callAction="(data) => emit('callAction', data)"
        />
    </PaginationList>

    <PaginationList v-else-if="props.activePage >= 5 && props.activePage <= props.totalPages - 4" class="pagination__list_grid" :style="`--grid-columns-short: 7`">
        <PaginationItem 
            :item="1"
            :activePage="props.activePage"
            @callAction="(data) => emit('callAction', data)"
        />
        <PaginationItem 
            class="pagination__item_disabled"
            :item="'...'"
            :activePage="props.activePage"
        />
        <PaginationItem 
            v-for="item in 3" 
            :item="props.activePage - 2 + item"
            :activePage="props.activePage"
            @callAction="(data) => emit('callAction', data)"
            :class="props.activePage - 2 + item == props.activePage ? 'pagination__item_active' : ''"
        />
        <PaginationItem 
            class="pagination__item_disabled"
            :item="'...'"
            :activePage="props.activePage"
        />
        <PaginationItem 
            :item="props.totalPages"
            :activePage="props.activePage"
            @callAction="(data) => emit('callAction', data)"
        />
    </PaginationList>

    <PaginationList v-else class="pagination__list_grid" :style="`--grid-columns-short: 7`">
        <PaginationItem 
            :item="1"
            :activePage="props.activePage"
            @callAction="(data) => emit('callAction', data)"
        />
        <PaginationItem 
            class="pagination__item_disabled"
            :item="'...'"
            :activePage="props.activePage"
        />
        <PaginationItem 
            v-for="item in 5" 
            :item="endItems(item)"
            :activePage="props.activePage"
            @callAction="(data) => emit('callAction', data)"
            :class="endItems(item) == props.activePage ? 'pagination__item_active' : ''"
        />
    </PaginationList>
</template>

<script setup>
    import './PaginationListLarge.scss';
    
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

    const emit = defineEmits([
        'callAction'
    ])

    // Определение последнего элемента
    const endItems = (item) => {
        let Arr = []
        for (let i = 0; i < 5; i++) {
            Arr.push(props.totalPages - i)
        }
        return Arr.reverse()[item-1]
    }
</script>
