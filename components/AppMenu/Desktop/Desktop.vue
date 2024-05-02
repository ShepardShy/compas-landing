<template>
    <header class="menu menu_desktop" ref="menuRef">
        <div class="container">
            <div class="menu__links">
                <NuxtLink :to="menu.length > 0 ? menu[0].link : '/'" class="menu__logo">
                    <IconLogo />
                </NuxtLink>

                <div class="menu__content">
                    <nav class="menu__list">
                        <NuxtLink
                            v-show="!item.is_hidden"
                            v-for="item in menu"
                            class="menu__item" 
                            :to="item.link"
                        >
                            {{ item.name }}
                        </NuxtLink>
                    </nav>
                </div>
            </div>

            <div class="menu__actions">
                <a href="tel:74951184422" class="menu__link">
                    +7 495 118-44-22
                </a>
                <div class="menu__buttons">
                    <NuxtLink class="button-text" to="/auth?tab=entry">
                        Вход
                    </NuxtLink>
                    <NuxtLink to="/auth?tab=registration">
                        <AppButton class="button_blue">
                            Регистрация
                        </AppButton>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </header>
</template>
    
<script setup>
    import './Desktop.scss'

    import IconLogo from '@/components/AppIcons/Logo/Logo.vue'
    import AppButton from '@/components/AppButton/AppButton.vue'

    const menuRef = ref(null)

    const menu = inject('menu')

    const emit = defineEmits([
       'callAction'
    ])
</script>
    