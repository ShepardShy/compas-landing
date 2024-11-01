<template>
    <div class="warning__form">
        <div class="warning__text">
            Оплатить штраф с помощью {{ activePayment.name }}
        </div>


        <div class="warning__actions">
            <form ref="paymentFormRef" target="_blank" class="button" method="get" action="https://www.payanyway.ru/assistant.htm?version=v3">
                <input type="hidden" name="MNT_ID" value="70116321">
                <input type="hidden" name="MNT_SUCCESS_URL" value="https://compas.pro/payment">
                <input type="hidden" name="MNT_CURRENCY_CODE" value="RUB">
                <input type="hidden" name="MNT_AMOUNT" :value="activePayment.percentValue">
                <input type="hidden" name="MNT_TRANSACTION_ID" :value="activePayment.transaction_id">
                <input type="hidden" name="MNT_DESCRIPTION" :value="`Оплата штрафа ${activePayment.id} от аккаунта ${host.hostname == 'localhost' ? 'compas' : host.hostname.split('.')[0]} по постановлению ${activePayment?.fine?.number_doc}` ">
                
                <input type="hidden" name="javascriptEnabled" value="true">
                <input type="hidden" name="followup" value="true">
                <input type="hidden" name="paymentSystem.unitId" :value="activePayment.slugIDForm">
                <input type="submit" class="pseudo-button" value="Оплатить" @click.prevent="() => getMonetaPayID()">
            </form>

            <AppButton class="warning__button" @click="() => showWarning()">
                Отмена
            </AppButton>
        </div>
    </div>
</template>

<script setup>
    import './Form.scss';
    import AppButton from '@/components/AppButton/AppButton.vue';
    import tableScripts from '@/stores/tableScripts/Table'
    import commonScripts from "~/commonScripts/commonScripts";
    
    const activePayment = inject('activePayment')
    const host = useRequestURL();
    const state = inject('state')
    const isShow = inject('isShow')
    const paymentFormRef = ref(null)

    const getMonetaPayID = async () => {
        const res = await tableScripts.getMonetaPayID({...activePayment.value, value: activePayment.value?.percentValue})

        if(res?.success){
            paymentFormRef.value.submit()
        }else if(res?.error){
            commonScripts.showNotification(
				{
					title: "Ошибка при оплате",
					description: res?.error,
				},
				"error"
			);
            const paymentRow = activePayment.value.bodyData.find(i=>i.id == activePayment.value.id);
            paymentRow.payment.state = 1;
        }

        setTimeout(() => {
            isShow.value.state = false
        }, 200);
    }

    onMounted(() => {
        activePayment.value.transaction_id =  new Date().getTime() + activePayment.value.id
    })

    // Показать окно предупреждения
    const showWarning = () => {
        state.value = 'common'
    }  
</script>
