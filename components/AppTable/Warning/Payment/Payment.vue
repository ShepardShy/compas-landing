<template>
    <AppWarning @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            Оплата штрафа
        </template>

        <template #body>
            <div class="warning__text">
                Будет оплачен штраф в размере <b> {{ activePayment.value }} </b> рублей. Продолжить?
            </div>
            <div class="warning__actions">
                <AppButton class="button_blue" @click="() => emit('callAction', {action: 'payment', value: true})">
                    Оплатить
                </AppButton>
                <AppButton @click="() => showWarning(false)">
                    Отмена
                </AppButton>
            </div>
        </template>
    </AppWarning>
</template>

<script setup>
    import './Payment.scss';
    
    import { inject } from 'vue'

    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppWarning from '@/components/AppWarning/AppWarning.vue';

    const isShow = inject('isShow')
    const activePayment = inject('activePayment')

    const emit = defineEmits([
        'callAction'
    ])

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    }    
</script>
