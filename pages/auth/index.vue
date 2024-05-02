<template>
    <AuthPage />
</template>

<script setup>
    import AuthPage from '~/components/Templates/AuthPage/AuthPage.vue';
    
    // Мета теги
    useHead({
        title: 'Авторизация . Компас',
        meta: [
            { 
                name: 'description', 
                content: 'Описание.' 
            },
        ],
    })
</script>
