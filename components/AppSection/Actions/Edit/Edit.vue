<template>
    <div class="actions__content">
        <AppButton class= "action-button" @click="() => !props.loaderButton ? emit('callAction', {action: 'edit', value: true}) : ''">
            <IconEdit class="actions__icon">
                Редактировать
            </IconEdit>
        </AppButton>
        <AppButton class= "action-button" @click="() => !props.loaderButton ? emit('callAction', {action: 'cancel', value: true}) : ''">
            Отмена
        </AppButton>
        <AppButton class="action-button button_red action-button_right" @click="() => !props.loaderButton ? emit('callAction', {action: 'initDelete', value: true}) : ''">
            <IconEdit class="actions__icon">
                Удалить
            </IconEdit>
        </AppButton>
    </div>
</template>

<script setup>
    import './Edit.scss';
    
    import AppButton from '@/components/AppButton/AppButton.vue'
    import IconEdit from '@/components/AppIcons/Edit/Edit.vue'

    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        loading: {
            default: false,
            type: Boolean
        }
    })
</script>
