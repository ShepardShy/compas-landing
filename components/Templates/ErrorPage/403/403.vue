<template>
    <figure class='ibg error__img'>
        <img src='/pages/error/403.svg' alt='Доступ к странице ограничен'>
    </figure>

    <AppH1 class="error__title">
        Доступ к странице ограничен, ошибка 403
    </AppH1>

    <NuxtLink to='/' class="error__link">
        Главная страница
    </NuxtLink>
</template>

<script setup>
    import './403.scss';

    import AppH1 from '@/components/AppHeaders/H1/H1.vue';
</script>
