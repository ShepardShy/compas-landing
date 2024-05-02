<template>
    <div class="total">
        <div class="total__list">
            <div class="total__item">
                <div class="total__title">
                    Количество:
                </div>
                <div class="total__value">
                    {{ setCount }} шт.
                </div>
            </div>
            <div class="total__item">
                <div class="total__title">
                    Общий вес:
                </div>
                <div class="total__value">
                    {{ setWeight }} кг
                </div>
            </div>
        </div>

        <div class="total__list">
            <div class="total__item">
                <div class="total__title">
                    Сумма:
                </div>
                <div class="total__value">
                    {{ setSum }} Руб.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import './Total.scss';
    
    import { inject, computed } from 'vue'

    const bodyData = inject('bodyData')

    const setSum = computed(() => {
        return bodyData.value.length == 0 ? 0 : bodyData.value.map(row => Number(row.product_price) * Number(row.product_count)).reduce((a, b) => a + b).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }) 

    const setCount = computed(() => {
        return bodyData.value.length == 0 ? 0 : bodyData.value.map(row => Number(row.product_count)).reduce((a, b) => a + b).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }) 

    const setWeight = computed(() => {
        return bodyData.value.length == 0 ? 0 : bodyData.value.map(row => Number(row.product_weight) * Number(row.product_count)).reduce((a, b) => a + b).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }) 
</script>
