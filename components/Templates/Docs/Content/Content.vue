<template>
    <div class="personal-docs">
        <AppBreadcrambs 
            :breadcrumbs="breadcrumbs"
        />
        <div class="personal-docs__header" v-if="activeDoc != null">
            <div class="personal-docs__text" >
                г. {{ activeDoc.city }}
            </div>
            <div class="personal-docs__text">
                Дата размещения: {{ setDate }}
            </div>
        </div>
        <AppH1 class="personal-docs__title" id="#h1">
            {{ activeDoc ? activeDoc.h1 : null }}
        </AppH1>
        <article class="personal-docs__content" v-html="activeDoc ? activeDoc.content : null" ref="personalDocRef" >
        </article>
        <DocsNav v-if="activeDoc != null"/>
    </div>
</template>

<script setup>
    import './Content.scss';
    
    import docs from '../docs.json'
    import DocsNav from './Nav/Nav.vue'
    import AppH1 from '@/components/AppHeaders/H1/MobileMenu/MobileMenu.vue';
    import AppBreadcrambs from '@/components/AppBreadcrambs/Breadcrambs.vue';

    const activeDoc = ref(null)
    const route = useRoute()
    const personalDocRef = ref(null) 

    provide('personalDocRef', personalDocRef)

    onMounted(() => {
        activeDoc.value = docs.find(p => p.url == route.params.doc)
        breadcrumbs.value.push({
            title: activeDoc.value.title,
            link: activeDoc.value.url
        })
    })

    let breadcrumbs = ref([
        {
            title: 'Главная страница',
            link: '/'
        },
        {
            title: 'Документы',
            link: `/docs`
        }
    ])

    const setDate = computed(() => {
        return new Date(activeDoc.value.date).toLocaleDateString("ru-RU", {year:"numeric", month: "2-digit", day:"2-digit"})
    })
</script>
