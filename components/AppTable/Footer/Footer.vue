<template>
    <div class="table-template__footer table-footer">
        <div class="table-footer__count-selected">
            <span class="table-footer__count-selected-title">Выбрано: </span> {{ bodyData.filter(p => p.isChoose).length }}
        </div>

        <AppPagination 
            :totalPages="footerData.pages"
            :activePage="footerData.activePage"
            class="table-footer__pagination" 
            @callAction="(data) => callAction({action: 'changePage', value: data.value})"
        />

        <div class="table-footer__visible-elems">
            <AppSelect 
                :item="{
                    id: 0,
                    key: 'visibleElems',
                    value: footerData.count,
                    focus: false,
                    required: false,
                    title: 'На странице:',
                    lockedOptions: [],
                    options: [
                        {
                            label: '25',
                            value: 25
                        },
                        {
                            label: '50',
                            value: 50
                        },
                        // {
                        //     label: '100',
                        //     value: 100
                        // }
                    ]
                }"
                :isFiltered="false"
                :isHaveNullOption="false"
                @changeValue="(data) => callAction({action: 'changeVisibleElems', value: data.value})"
            />
        </div>
    </div>
</template>

<script setup>
    import './Footer.scss';
    
    import { inject } from 'vue'

    import AppPagination from './Pagination/Pagination.vue'
    import AppSelect from '@/components/AppSelects/Select/Select.vue'

    const sortItem = inject('sortItem')
    const bodyData = inject('bodyData')
    const footerData = inject('footerData')

    const emit = defineEmits([
        'callAction'
    ])

    // Вызов действия для футера
    const callAction = (data) => {
        // Изменение количества отображаемых элементов
        const changeVisibleElems = (value) => {
            footerData.value.activePage = 1
            footerData.value.count = value
            emit('callAction', {action: 'getTableData', value: sortItem.value})
            emit('callAction', {action: 'setVisibleElems', value: value})
        }

        // Изменение активной страницы
        const changePage = (value) => {
            window.scrollTo(0, 0);
            footerData.value.activePage = value
            emit('callAction', {action: 'getTableData', value: sortItem.value})
        }

        switch (data.action) {
            // Изменение количества отображаемых элементов
            case 'changeVisibleElems':
                changeVisibleElems(data.value)
                break;
            // Изменение активной страницы
            case 'changePage':
                changePage(data.value)
                break;
            default:
                break;
        }
    }
</script>
