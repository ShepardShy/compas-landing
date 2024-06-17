<template>
    <div class="actions" v-if="props.actionState != null || props.loaderState == 'actionLoad'">
        <ButtonsEdit 
            v-if="props.actionState == 'editting'"
            :is_admin="props.is_admin"
            :permissions="props.permissions"
            @callAction="(data) => emit('callAction', data)"
        />

        <ButtonsSave 
            v-else-if="props.actionState == 'saving' || props.loaderState == 'actionLoad'"
            :loaderState="props.loaderState"
            @callAction="(data) => emit('callAction', data)"
        />

        <ButtonsRestore 
            v-else-if="props.actionState == 'restoring' || props.loaderState == 'actionLoad'"
            :loaderState="props.loaderState"
            @callAction="(data) => emit('callAction', data)"
        />
    </div>
</template>

<script setup>
    import './Actions.scss';
    
    import ButtonsEdit from './Edit/Edit.vue'
    import ButtonsSave from './Save/Save.vue'
    import ButtonsRestore from './Restore/Restore.vue'

    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        actionState: {
            default: null,
            type: String
        },
        loaderState: {
            default: null,
            type: String
        },
        is_admin: {
            default: false,
            type: Boolean
        },
        permissions: {
            default: {},
            type: Object
        }
    })
</script>
