<template>
    <div class="actions__content">
        <AppButton class= "button_blue action-button" :disabled="props.loaderState == 'actionLoad'" :class="props.loaderState == 'actionLoad' ? 'button_loading' : ''" @click="() => !props.loaderButton ? emit('callAction', {action: 'initRestore', value: true}) : ''">
            Восстановить
        </AppButton>
        <AppButton class= "action-button" @click="() => !props.loaderButton ? emit('callAction', {action: 'cancel', value: true}) : ''">
            Отмена
        </AppButton>
    </div>
</template>

<script setup>
    import './Restore.scss';
    
    import AppButton from '@/components/AppButton/AppButton.vue'

    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        loading: {
            default: false,
            type: Boolean
        },
        loaderState: {
            default: null,
            type: String
        }
    })
</script>
