<template>
    <AppH1 class="auth__title">
        Вход на портал <span class="auth__title-portal__name"></span>
    </AppH1>
    <AppSection class="auth__form">
        <div class="auth__error" v-show="userStore.authError.status">
            {{ userStore.authError.text }}
        </div>
        <AppInput
            class="auth__input auth__input_substr"
            :item="{
                id: 0,
                title: 'Название портала',
                value: userStore.authData.portalName,
                placeholder: 'Название портала',
                type: 'text',
                key: 'portalName',
                substring: '.compas.pro'
            }"
            :mask="null"
            :disabled="false"
            :enabledAutocomplete="true"
            @changeValue="(data) => changeValue(data)"
        />
        <AppInput
            class="auth__input"
            :item="{
                id: 0,
                title: 'E-mail',
                value: userStore.authData.email,
                placeholder: 'E-mail',
                type: 'text',
                key: 'email'
            }"
            :mask="null"
            :disabled="false"
            :enabledAutocomplete="true"
            @keyup.enter="logIn()"
            @changeValue="(data) => changeValue(data)"
        />
        <AppInput
            class="auth__input"
            :item="{
                id: 1,
                title: 'Пароль',
                value: userStore.authData.password,
                placeholder: 'Пароль',
                type: 'password',
                key: 'password'
            }"
            :mask="null"
            :disabled="false"
            :enabledAutocomplete="true"
            @keyup.enter="logIn()"
            @changeValue="(data) => changeValue(data)"
        />
        <AppCheckbox
            class="auth__checkbox"
            :item="{
                id: 2,
                title: 'Запомнить пароль',
                value: userStore.authData.remember_me,
                placeholder: 'Запомнить пароль',
                type: 'checkbox',
                key: 'remember_me'
            }"
            @changeValue="(data) => changeValue(data)"
        />
        <AppButton :class="userStore.authButtonLoad ? 'button_loading' : ''" class="auth__button button_blue" @click="() => logIn()">
            Войти
        </AppButton>

        <div class="auth__text auth__link" @click="() => $emit('changeActiveTab', 'forget')">
            Восстановление пароля
        </div>
    </AppSection>
    <div class="auth__text auth__subtext">
        Нет портала? <span class="auth__link" @click="() => $emit('changeActiveTab', 'registration')"> Создайте бесплатный. </span>
    </div>
</template>

<script setup>
    import './Entry.scss';

    import AppInput from '~/components/AppInputs/Input/Input.vue';
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue';
    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppSection from '@/components/AppSection/AppSection.vue';
    import AppH1 from '@/components/AppHeaders/H1/H1.vue';

    import { useUserStore } from '@/stores/userStore.js'
    const userStore = useUserStore()

    const props = defineProps({
        authRef: {
            default: null
        }
    })

    const changeValue = (data) => {
        userStore.authData[data.key] = data.value
    }

    const logIn = () => {
        if (!userStore.authButtonLoad) {
            userStore.logIn(userStore.authData, props.authRef)
        }
    }
</script>
