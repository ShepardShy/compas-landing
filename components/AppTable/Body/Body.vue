<template>
    <draggable 
        tag="tbody"
        class="table__body"
        :itemKey="props.slug"
        v-model="bodyData" 
        :group="props.groupBody"
        :handle="props.isDraggableRow ? '.table__row' : '.icon__draggable'"
        @start="() => dragStart()"
        @end="(event) => emit('callAction', {action: 'moveRows', value: event})" 
    >
        <template #item="{ element: row, index }">
            <TableRow 
                :row="row"
                :rowId="index + 1"
                :rowsIds="bodyData.map(p => p.id)"
                :slug="props.slug"
                :isTrash="props.isTrash"
                :actionType="props.actionType"
                :permissions="props.permissions"
                :isCanOpenCount="props.isCanOpenCount"
                :isPermanentEdit="props.isPermanentEdit"
                @callAction="(data) => emit('callAction', data)"
                @changeValue="data=> emit('changeValue', data)"
            />
        </template>
    </draggable>
</template>

<script setup>
    import './Body.scss';
    
    import { inject } from 'vue'

    import draggable from 'vuedraggable'
    import TableRow from './Row/Row.vue'
    
    const bodyData = inject('bodyData')
    const backupRows = inject('backupRows')
    const actionState = inject('actionState')
    
    const props = defineProps({
        isTrash: {
            default: false,
            type: Boolean
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
        groupBody: {
            default: null,
            type: String
        },
        isDraggableRow: {
            default: false,
            type: Boolean
        },
        isCanOpenCount: {
            default: 0,
            type: Number
        }
    })

    const dragStart = () => {
        if (actionState.value != 'saving') {
            backupRows.value = JSON.parse(JSON.stringify(bodyData.value))
        }
    }

    const emit = defineEmits([
        'callAction',
        'changeValue'
    ])
</script>
