<template>
    <div class="actions__content">
        <AppButton class= "action-button" v-if="permissions.update_p != 'N'" @click="() => !props.loaderButton ? emit('callAction', {action: 'edit', value: true}) : ''">
            <IconEdit class="actions__icon">
                Редактировать
            </IconEdit>
        </AppButton>
        <AppButton class= "action-button" @click="() => !props.loaderButton ? emit('callAction', {action: 'cancel', value: true}) : ''">
            Отмена
        </AppButton>
        <AppButton v-if="permissions.delete_p != 'N'" class="action-button button_red action-button_right" @click="() => !props.loaderButton ? emit('callAction', {action: 'initDelete', value: true}) : ''">
            <IconDelete class="actions__icon">
                Удалить
            </IconDelete>
        </AppButton>
    </div>
</template>

<script setup>
    import './Edit.scss';
    
    import AppButton from '@/components/AppButton/AppButton.vue'
    import IconEdit from '@/components/AppIcons/Edit/Edit.vue'
    import IconDelete from '@/components/AppIcons/Delete/Delete.vue';

    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        loading: {
            default: false,
            type: Boolean
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
