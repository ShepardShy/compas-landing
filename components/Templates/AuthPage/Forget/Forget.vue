<template>
    <AppH1 class="auth__title">
        Восстановление пароля
    </AppH1>
    <AppSection class="auth__form">
        <AppInput
            class="auth__input auth__input_substr"
            :item="{
                id: 0,
                title: 'Название портала',
                value: userData.portalName,
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
                value: userData.email,
                placeholder: 'E-mail',
                type: 'text',
                key: 'email'
            }"
            :mask="null"
            :disabled="false"
            :enabledAutocomplete="true"
            @changeValue="(data) => changeValue(data)"
        />
        <AppButton :disabledOption="disabledButton" :class="userStore.authButtonLoad ? 'button_loading' : ''" class="auth__button button_blue" @click="() => forgetPassword()">
            Восстановить пароль   
        </AppButton>

        <div class="auth__text auth__link" @click="() => $emit('changeActiveTab', 'entry')">
            Войти в портал
        </div>
    </AppSection>
    <div class="auth__text auth__subtext">
        Нет портала? <span class="auth__link" @click="() => $emit('changeActiveTab', 'registration')"> Создайте бесплатный. </span>
    </div>
</template>

<script setup>
    import './Forget.scss';
    
    import AppInput from '@/components/AppInputs/Input/Input.vue';
    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppSection from '@/components/AppSection/AppSection.vue';
    import AppH1 from '@/components/AppHeaders/H1/H1.vue';

    import { useUserStore } from '@/stores/userStore.js'
    const userStore = useUserStore()

    let userData = ref({
        email: '',
        portalName: ''
    })

    const changeValue = (data) => {
        userData.value[data.key] = data.value 
    }

    const forgetPassword = () => {
        if (!userStore.authButtonLoad) {
            userStore.forgetPassword(userData.value)
        }
    }

    const disabledButton = computed(() => {
        let txt = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return userData.value.email == '' || !txt.test(userData.value.email)
    })
</script>
