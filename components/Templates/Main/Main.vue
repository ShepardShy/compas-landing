<template>
    <MainFines />
    <MainCompanies />
    <MainPluses />
    <CommonProgramm 
        class="main__programm"
        :title="'Проверки абсолютно бесплатны'"
        :desc="'Вы можете проверять неограниченное кол-во машин на наличие штрафов и оплачивать в одном интерфейсе'"
    />
    <MainTariffs />
    <PlusesFines />
    <CommonSocial class="main__social"/>
</template>

<script setup>
    import './Main.scss';
    
    import MainFines from './Fines/Fines.vue';
    import MainCompanies from './Companies/Companies.vue';
    import MainPluses from './Pluses/Pluses.vue'
    import CommonProgramm from '@/components/Templates/Common/Programm/Programm.vue';
    import MainTariffs from '@/components/Templates/Main/Tariffs/Tariffs.vue';
    import PlusesFines from './PlusesFines/PlusesFines.vue'
    import CommonSocial from '@/components/Templates/Common/Social/Social.vue';
</script>
