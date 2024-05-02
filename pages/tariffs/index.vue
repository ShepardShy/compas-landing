<template>
    <TemplateTariffs />
</template>

<script setup>
    import TemplateTariffs from '@/components/Templates/Tariffs/Tariffs.vue';

    // Мета теги
    useHead({
        title: 'Тарифы . Компас',
        meta: [
            { 
                name: 'description', 
                content: 'Описание.' 
            },
        ],
    })
</script>
