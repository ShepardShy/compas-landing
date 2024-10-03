<template>
    <FormItem 
        class="form-item__payment" 
        :required="false"
    >
        <FormLabel
            v-if="props.item"
            v-show="props.item.title != null && props.item.title != ''"
            :title="props.item.title"
        />

        <div 
            class="button-payment" 
            @click="emit('initPayment', {
                value: props.item.value,
                key: props.item.key
            })" 
            :class="
                [null, undefined].includes(props.item) || 
                [null, undefined].includes(props.item.value) || 
                (props.item.state) ? 'button-payment_disabled' : ''
            " 
        >
            {{ setTitle }}
        </div>
    </FormItem>
</template>

<script setup>
    import './ButtonPayment.scss';

    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';

    const emit = defineEmits([
        'initPayment'
    ])

    const props = defineProps({
        item: {
            default: {
                id: 0,
                key: '',
                title: null,
                value: 0,
                state: false
            },
            type: Object
        }
    })

    const setTitle = computed(() => {
        if (props.item.state == null) {
            return ''
        } else if (props.item && !props.item.state) {
            return `Оплатить ${props.item.value} р.`
        } else {
            return `Оплачено`
        }
    })
</script>
