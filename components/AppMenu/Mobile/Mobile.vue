<template>
    <aside class="menu menu_mobile">
        <IconGamburger 
            class="menu__gamburger"
            @click="() => callAction({action: 'showMenu', value: true})"
        />

        <div class="menu__content" v-show="settingsMenu.isShow">
            <AppH2 class="menu__nav-back" @click="() => callAction({action: 'navigateMenu', value: settingsMenu.activeTab == null ? false : null})">
                <IconArrow />
                {{ settingsMenu.activeTab == null ? 'Меню' : settingsMenu.activeTab.title }}
            </AppH2>
            <nav class="menu__list" v-if="settingsMenu.activeTab == null">
                <NuxtLink @click="() => callAction({action: 'showMenu', value: false})" :to="item.link" class="menu__item" v-for="item in menu" :key="item.id" v-show="item.enabled">
                    {{ item.name }}
                </NuxtLink>
            </nav>
        </div>
    </aside>
</template>

<script setup>
    import './Mobile.scss';

    import IconArrow from '@/components/AppIcons/Arrow/Arrow.vue'
    import IconGamburger from '@/components/AppIcons/Gamburger/Gamburger.vue'

    import AppH2 from '@/components/AppHeaders/H2/H2.vue'

    let settingsMenu = ref({
        isShow: false,
        activeTab: null
    })    

    const menu = inject('menu')

    // Вызов действий
    const callAction = (data) => {
        // Показ/скрытие меню
        const showMenu = (state) => {
            if (!state) {
                settingsMenu.value.activeTab = null
            }
            settingsMenu.value.isShow = state

            if (state) {
                document.body.classList.add('body_uncscroll')
            } else {
                document.body.classList.remove('body_uncscroll')
            }
        }

        // Навигация по меню
        const navigateMenu = (value) => {
            if (value == false) {
                showMenu(false)
            } else {
                settingsMenu.value.activeTab = settingsMenu.value.tabs.find(tab => tab.tab == value) ?? null
            }
        }

        switch (data.action) {
            // Показ/скрытие меню
            case 'showMenu':
                showMenu(data.value)
                break;
        
            // Навигация по меню
            case 'navigateMenu':
                navigateMenu(data.value)
                break;
            default:
                break;
        }
    }
</script>
