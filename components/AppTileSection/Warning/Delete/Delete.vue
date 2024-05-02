<template>
    <AppWarning @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            Удаление
        </template>

        <template #body>
            <div class="warning__text">
                Будет удалено поле <b> {{ removingField.title }} </b>. Продолжить?
            </div>
            <div class="warning__actions">
                <AppButton class="button_red" @click="() => emit('callAction', {action: 'delete', value: true})">
                    Удалить
                </AppButton>
                <AppButton @click="() => showWarning(false)">
                    Отмена
                </AppButton>
            </div>
        </template>
    </AppWarning>
</template>

<script setup>
    import './Delete.scss';
    
    import { inject } from 'vue'

    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppWarning from '@/components/AppWarning/AppWarning.vue';

    const isShow = inject('isShow')
    const removingField = inject('removingField')

    const emit = defineEmits([
        'callAction'
    ])

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    }    
</script>
