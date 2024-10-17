<template>
    <tr 
        ref="rowRef"
        class="table__row" 
        @click="() => clickRow(true)"
        v-click-out-side="(event) => clickRow(false)" 
        :class="setClasses"
    >
        <TableItem 
            v-for="item in fields"
            :row="props.row"
            :item="item"
            :rowId="props.rowId"
            :slug="props.slug"
            :isTrash="isTrash"
            :actionType="props.actionType"
            :permissions="props.permissions"
            :isPermanentEdit="props.isPermanentEdit"
            :isCanOpenCount="props.isCanOpenCount"
            @clickRow="() => clickRow(true)"
            @dragRowStart="(event) => setDragImage(event)"
            @dragRowEnd="(event) => dragRowEnd(event)"
            @callAction="(data) => emit('callAction', data)"
            @changeValue="data=> emit('changeValue', data)"
        />
    </tr>
</template>

<script setup>
    import './Row.scss';
    
    import { inject, ref } from 'vue'
    import { clickOutSide as vClickOutSide } from '@mahdikhashan/vue3-click-outside'

    import TableItem from '../Item/Item.vue'

    const rowRef = ref(null)
    const fields = inject('fields')

    const props = defineProps({
        isTrash: {
            default: false,
            type: Boolean
        },
        row: {},
        rowId: {
            default: 0,
            type: Number
        },
        rowsIds: {
            default: [],
            type: Array
        },
        slug: {
            default: '',
            type: String
        },
        isPermanentEdit: {
            default: false,
            type: Boolean
        },
        actionType: {
            default: 'view',
            type: String
        },
        permissions: {
            default: {},
            type: Object
        },
        isCanOpenCount: {
            default: 0,
            type: Number
        }
    })

    const emit = defineEmits([
        'callAction',
        'changeValue'
    ])

    // Добавление классов приоритета при клике на строку
    const clickRow = (state) => {
        if (rowRef.value != null) {
            if (state) {
                rowRef.value.classList.add('table_row_clicked')
                emit('callAction', {
                    action: 'chooseRow',
                    value: props.row
                })
            } else {
                rowRef.value.classList.remove('table_row_clicked')
            }
        }
    }

    // Создание колонки для дататрансфера
    const setDragImage = (event) => {
        if (document.getElementById('clone-elem') == null) {
                let tbody = document.createElement("tbody")
                tbody.classList.add('table__body')
                let row = rowRef.value.cloneNode(true)
                tbody.id = "clone-elem";
                row.classList.add('table__row_clone')
                row.classList.add('table__row')
                row.style.width = `${ rowRef.value.offsetWidth}px`
                let items = rowRef.value.querySelectorAll('.table__item')
                row.querySelectorAll('.table__item').forEach((element, index) => {
                    element.style.setProperty("--defaultWidth", `${items[index].offsetWidth.toFixed(2)}px`)
                });
                tbody.appendChild(row)
                document.body.appendChild(tbody);
                event.dataTransfer.setDragImage(tbody, event.offsetX, event.offsetY);
        }
    }

    const dragRowEnd = (event) => {
        let removingItem = document.getElementById('clone-elem')
        if (removingItem != null) {
            removingItem.remove()
        }
    }

    const setClasses = computed(() => {
        let classes = []

        if (props.isCanOpenCount != 0) {
            if (!props.rowsIds.sort((prev, next) => Number(prev) - Number(next)).slice(0, props.isCanOpenCount).includes(props.row.id)) {
                classes.push('table__row_disabled')
            }
        }

        if (props.row.isEdit) {
            classes.push('table__row_edit')
        } else if (props.row.isChoose) {
            classes.push('table__row_choosed')
        }

        if (props.row.isUpdated) {
            classes.push('table__row_updated')
        }

        return classes
    })
</script>
