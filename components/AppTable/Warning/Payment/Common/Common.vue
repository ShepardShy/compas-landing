<template>
    <div class="warning__text">
        Будет оплачен штраф в размере <b> {{ setValue }} </b> рублей. Продолжить?
    </div>
    <div class="warning__text_error" v-if="(activePayment.value > props.balance) && (userStore.activePaymentOption && userStore.activePaymentOption.slug == 'compas_pay')">
        Для того, чтобы оплатить штраф, необходимо пополнить счет на сумму в размере <b> {{ activePayment.value }} </b> рублей.
    </div>
    <div class="warning__actions">
        <div class="button-details">
            <AppButton class="button_blue" :disabledOption="(userStore.activePaymentOption && userStore.activePaymentOption.slug == 'compas_pay') && (activePayment.value > props.balance)" :class="props.loaderButton ? 'button_loading' : ''" @click="() => emit('callAction', {action: 'payment', value: activeOption})">
                    <span class="warning__text">
                        {{ activeOption.name }} 
                        
                        <template v-if="activeOption.slug == 'compas_pay'">
                            <span class="warning__text_green"> {{ props.balance }} </span> руб.
                        </template>
                    </span> 
            </AppButton>

            <AppPopup class="button-details__popup" :isCanSelect="false" :closeByClick="true">
                <template #summary> 
                    <IconTriangle />
                </template>
                <template #content>
                    <PopupOption v-for="option in options" @click="() => setOption(option)">
                        {{ option.name }} 

                        <template v-if="option.slug == 'compas_pay'">
                            <span class="warning__text_green"> {{ props.balance }} </span> руб.
                        </template>
                    </PopupOption>
                </template>
            </AppPopup>
        </div>
        <NuxtLink to="/settings/?tab=tariffs"  v-if="(activePayment.value > props.balance) && (userStore.activePaymentOption && userStore.activePaymentOption.slug == 'compas_pay')">
            <AppButton class="button_blue">
                Пополнить счет
            </AppButton>
        </NuxtLink>
        <AppButton @click="() => showWarning(false)">
            Отмена
        </AppButton>
    </div>
</template>

<script setup>
    import './Common.scss';
    
    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppPopup from '@/components/AppPopup/Popup.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';
    import IconTriangle from '@/components/AppIcons/Triangle/Triangle.vue';

    import { useUserStore } from '@/stores/userStore.js'
    const userStore = useUserStore()

    const props = defineProps({
        balance: {
            default: 0,
            type: Number
        }
    })

    const isShow = inject('isShow')
    const activePayment = inject('activePayment')
    const activeOption = ref({
            name: 'СБП (+1%)',
            slug: 'payment',
            slugIDForm: '12299232',
            percent: 1,
    })
    const options = [
        {
            name: 'СБП (+1%)',
            slug: 'payment',
            slugIDForm: '12299232',
            percent: 1,
        },
        {
            name: 'Visa, MasterCard, МИР (+2.7%)',
            slug: 'payment',
            slugIDForm: '9990214',
            percent: 2.7,
        }
    ]

    const emit = defineEmits([
        'callAction'
    ])

    const setOption = (option) => {
        userStore.activePaymentOption = option
        activePayment.value.slugIDForm = option.slugIDForm
        activePayment.value.name = option.name
        activeOption.value = option
        activePayment.value.percentValue = setValue.value 
    }

    const setValue = computed(() => {
        if (activeOption.value.percent > 0) {
            return (activePayment.value.value + Number(activePayment.value.value * (activeOption.value.percent > 0 ? Number(activeOption.value.percent / 100) : 1))).toFixed(2)
        } else {
            return activePayment.value.value
        }
    })

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    }  

    onMounted(() => {
        activeOption.value = userStore.activePaymentOption
        // activePayment.value.percentValue = setValue.value 
        setOption(options[0])
    })
</script>
