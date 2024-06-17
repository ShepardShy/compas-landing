<template>
    <MainFines />
    <MainCompanies 
        :list="fines"
        :title="'1 000 компаний проверили и оплатили более 50 000 штрафов на 50% дешевле чем это делали раньше.'"
        :desc="'Бесплатная проверка авто, водителей, компании на наличие штрафов'"
    />
    <MainBase />
    <MainPluses />
    <CommonProgramm 
        class="main__programm"
        :title="'Проверки абсолютно бесплатны'"
        :desc="'Вы можете проверять неограниченное кол-во машин на наличие штрафов и оплачивать в одном интерфейсе'"
    />
    <!-- <MainTariffs /> -->
    <PlusesFines />
    <CommonSocial class="main__social"/>
</template>

<script setup>
    import './Main.scss';
    
    import MainBase from './Base/Base.vue'
    import MainFines from './Fines/Fines.vue';
    import MainPluses from './Pluses/Pluses.vue'
    import MainCompanies from '@/components/Templates/Common/Companies/Companies.vue';
    import CommonProgramm from '@/components/Templates/Common/Programm/Programm.vue';
    // import MainTariffs from '@/components/Templates/Main/Tariffs/Tariffs.vue';
    import PlusesFines from './PlusesFines/PlusesFines.vue'
    import CommonSocial from '@/components/Templates/Common/Social/Social.vue';


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
