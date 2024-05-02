<template>
    <AppWarning @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            Удаление
        </template>

        <template #body>
            <div class="warning__text">
                Будет удалено {{ bodyData.filter(p => p.isChoose).length }} строк. Продолжить?
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
    const bodyData = inject('bodyData')

    const emit = defineEmits([
        'callAction'
    ])

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    }    
</script>
