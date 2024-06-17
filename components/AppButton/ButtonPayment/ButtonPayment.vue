<template>
    <div class="button-payment" :class="props.item && !props.item.state ? 'button-payment_disabled' : ''" ref="buttonPaymentRef">
        {{ setTitle }}
    </div>
</template>

<script setup>
    import './ButtonPayment.scss';

    import { ref } from 'vue'

    const buttonPaymentRef = ref(null)

    const props = defineProps({
        item: {
            default: {
                value: 0,
                state: false
            },
            type: Object
        }
    })

    const setTitle = computed(() => {
        if (props.item && props.item.state) {
            return `Оплатить ${props.item.value} р.`
        } else {
            return `Оплачено`
        }
    })
</script>
