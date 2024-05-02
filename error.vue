<template>
    <div class="wrapper">
        <div class="page error">
            <AppMenu />
            <AppMain>
                <undefinedPage v-if="error.statusCode === 404"/>
                <restrictedPage v-else-if="error.statusCode === 403"/>
            </AppMain>
        </div>
    </div>
</template>

<script setup>
    import './error.scss';
    import '@/assets/default.scss'
    import '@/assets/fonts/fonts.css'

    import undefinedPage from '@/components/Templates/ErrorPage/404/404.vue';
    import restrictedPage from '@/components/Templates/ErrorPage/403/403.vue';
    import AppMenu from '@/components/AppMenu/AppMenu.vue';
    import AppMain from '@/components/AppMain/AppMain.vue';
    const error = useError();
    
    onMounted(() => {
        console.log(error);
    })
</script>
