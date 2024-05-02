<template>
    <MenuDesktop 
        @callAction="(data) => callAction(data)"
    />
    <MenuMobile />
</template>

<script setup>
    import './AppMenu.scss';

   import MenuDesktop from './Desktop/Desktop.vue'
   import MenuMobile from './Mobile/Mobile.vue'

   const emit = defineEmits([
       'callAction'
   ])

    let menu = ref([
        {
            "id": 1,
            "name": "Главная",
            "slug": "main",
            "sort": 0,
            "link": "/",
            "is_hidden": 1,
            "enabled": 1,
            "children": []
        },
        {
            "id": 1,
            "name": "Тарифы",
            "slug": "main",
            "sort": 0,
            "link": "/tariffs",
            "is_hidden": 0,
            "enabled": 1,
            "children": []
        },
        {
            "id": 1,
            "name": "Контакты",
            "slug": "auth",
            "sort": 0,
            "link": "/contacts",
            "is_hidden": 0,
            "enabled": 1,
            "children": []
        },
        {
            "id": 1,
            "name": "Войти",
            "slug": "auth",
            "sort": 0,
            "link": "/auth?tab=registration",
            "is_hidden": 1,
            "enabled": 1,
            "children": []
        }
    ])

    provide('menu', menu)
</script>
