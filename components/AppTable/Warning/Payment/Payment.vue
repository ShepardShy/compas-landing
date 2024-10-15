<template>
    <AppWarning @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            Оплата штрафа
        </template>

        <template #body>
            <CommonForm 
                v-if="state == 'common'"
                :balance="props.balance"
                @callAction="(data) => callAction(data)"
            />

            <PaymentForm 
                v-if="state == 'payment'"
                :balance="props.balance"
                @callAction="(data) => callAction(data)"
            />
        </template>
    </AppWarning>
</template>

<script setup>
    import './Payment.scss';
    
    import AppWarning from '@/components/AppWarning/AppWarning.vue';
    import CommonForm from './Common/Common.vue';
    import PaymentForm from './Form/Form.vue';

    const isShow = inject('isShow')
    const state = ref('common')

    const props = defineProps({
        balance: {
            default: 0,
            type: Number
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    const callAction = (action) => {
        if (action.action == 'payment') {
            if (action.value.slug == 'payment') {
                state.value = 'payment'
            } else {
                emit('callAction', action)
            }
        } else {
            emit('callAction', action)
        }
    } 

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    }    

    provide('state', state)
</script>
