<template>
    <draggable 
        tag="tbody"
        class="table__body"
        itemKey="table-body"
        v-model="bodyData" 
        handle=".icon__draggable"
        @start="() => dragStart()"
        @end="(event) => emit('callAction', {action: 'moveRows', value: event.to.__draggable_component__.modelValue})" 
    >
        <template #item="{ element: row, index }">
            <TableRow 
                :row="row"
                :rowId="index + 1"
                :slug="props.slug"
                :isTrash="props.isTrash"
                :actionType="props.actionType"
                :isPermanentEdit="props.isPermanentEdit"
                @callAction="(data) => emit('callAction', data)"
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
        }
    })

    const dragStart = () => {
        if (actionState.value != 'saving') {
            backupRows.value = JSON.parse(JSON.stringify(bodyData.value))
        }
    }

    const emit = defineEmits([
        'callAction'
    ])
</script>
