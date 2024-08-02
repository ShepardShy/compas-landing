<template>
    <AppWarning @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            Оплата штрафа
        </template>

        <template #body>
            <div class="warning__text_error" v-if="activePayment.value > props.balance">
                Недостаточно средств
            </div>

            <div class="warning__text" v-if="activePayment.value > props.balance">
                На счету недостаточно средств. Для того, чтобы оплатить штраф, необходимо пополнить счет на сумму в размере <b> {{ activePayment.value }} </b> рублей.
            </div>
            <div class="warning__text" v-else>
                Будет оплачен штраф в размере <b> {{ activePayment.value }} </b> рублей. Продолжить?
            </div>
            <div class="warning__actions">
                <NuxtLink to="/settings/?tab=tariffs"  v-if="activePayment.value > props.balance">
                    <AppButton class="button_blue">
                        Пополнить счет
                    </AppButton>
                </NuxtLink>
                <AppButton v-else class="button_blue" @click="() => emit('callAction', {action: 'payment', value: true})">
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

    const props = defineProps({
        balance: {
            default: 0,
            type: Number
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    }    
</script>
