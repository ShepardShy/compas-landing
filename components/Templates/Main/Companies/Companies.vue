<template>
    <AppSection class="companies section_without-background">
        <AppH2>
            1 000 компаний проверили и оплатили более 50 000 штрафов на 50% дешевле чем это делали раньше.
        </AppH2>

        <div class="companies__desc">
            Бесплатная проверка авто, водителей, компании на наличие штрафов.
        </div>

        <div class="companies__list">
            <figure class='ibg companies__item' v-for="company in companies">
                <img :src='company.link' :alt='company.title'>
            </figure>
        </div>
    </AppSection>
</template>

<script setup>
    import './Companies.scss';

    import AppH2 from '@/components/AppHeaders/H2/H2.vue';
    import AppSection from '@/components/AppSection/AppSection.vue';
    
    let companies = [
        {
            id: 0,
            title: 'Аэроэкспресс',
            link: '/main/companies/aeroexpress.svg'
        },
        {
            id: 1,
            title: 'Бургер Кинг',
            link: '/main/companies/burger-king-logo.svg'
        },
        {
            id: 2,
            title: 'Комус',
            link: '/main/companies/komus.svg'
        },
        {
            id: 3,
            title: 'Почта России',
            link: '/main/companies/russian-post-logo.svg'
        },
        {
            id: 4,
            title: 'Спортмастер',
            link: '/main/companies/sberbank-logo.svg'
        },
        {
            id: 5,
            title: 'Сбербанк',
            link: '/main/companies/sportmaster.svg'
        }
    ]
</script>
