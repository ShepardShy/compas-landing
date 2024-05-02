<template>
    <AppSection class="social section_without-background">
        <AppH2>
            Присоединяйтесь к Compas в соцсетях
        </AppH2>

        <div class="social__description">
            Публикуем обучающие материалы Compas, анонсы мероприятий, рассказываем об обновлениях платформы Compas
        </div>

        <div class="social__icons">
            <a v-for="icon in icons" :href="icon.link" target="_blank" class="social__icon-link">
                <figure class='ibg social__icon'>
                    <img :src='icon.icon' :alt='icon.name'>
                </figure>
            </a>
        </div>
    </AppSection>
</template>

<script setup>
    import './Social.scss';

    import AppH2 from '@/components/AppHeaders/H2/H2.vue';
    import AppSection from '@/components/AppSection/AppSection.vue';

    let icons = [
        {
            name: 'Телеграм',
            link: 'https://t.me/compas_pro',
            icon: '/social/telegram.svg'
        },
        {
            name: 'ВКонтакте',
            link: 'https://vk.com/cmps_pr',
            icon: '/social/vk.svg'
        },
        {
            name: 'YouTube',
            link: 'https://www.youtube.com/@cmps-pro',
            icon: '/social/youtube.svg'
        }
    ]
    
</script>
