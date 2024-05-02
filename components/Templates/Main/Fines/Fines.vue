
<template>
    <AppSection class="fines section_without-background">
        <AppH1>
            Проверьте штрафы и зарегестрируйтесь в 1 клик
        </AppH1>
        <form class="fines__form" @click.prevent>
            <AppInput
                :item="{
                    focus: false,
                    id: 0,
                    placeholder: 'A000AA',
                    key: 'number',
                    type: 'text',
                    title: 'Номер автомобиля',
                    substring: null,
                    required: false,
                    external_link: null,
                    value: form.number,
                }"
                :disabled="false"
                :isUseEnter="false"
                :mask="'A###AA'"
                :isLink="null"
                :isReadOnly="false"
                @changeValue="(data) => changeValue(data)"
            />
            <AppInput
                :item="{
                    focus: false,
                    id: 0,
                    placeholder: '000',
                    key: 'region',
                    type: 'number',
                    title: 'Регион',
                    substring: null,
                    required: false,
                    external_link: null,
                    value: form.region,
                }"
                :disabled="false"
                :isUseEnter="false"
                :mask="null"
                :isLink="null"
                :isReadOnly="false"
                @changeValue="(data) => changeValue(data)"
            />
            <AppInput
                class="input_line"
                :item="{
                    focus: false,
                    id: 0,
                    placeholder: null,
                    key: 'certificate',
                    type: 'text',
                    title: 'Свидетельство о регистрации ТС',
                    substring: null,
                    required: false,
                    external_link: null,
                    value: form.certificate,
                }"
                :disabled="false"
                :isUseEnter="false"
                :mask="null"
                :isLink="null"
                :isReadOnly="false"
                @changeValue="(data) => changeValue(data)"
            />
            <AppInput
                class="input_line"
                v-show="form.number != '' && form.region != '' && form.certificate != ''"
                :item="{
                    focus: false,
                    id: 0,
                    placeholder: 'mail@mail.ru',
                    key: 'mail',
                    type: 'text',
                    title: 'Электронная почта для входа',
                    substring: null,
                    required: false,
                    external_link: null,
                    value: form.mail,
                }"
                :disabled="false"
                :isUseEnter="false"
                :mask="null"
                :isLink="null"
                :isReadOnly="false"
                @changeValue="(data) => changeValue(data)"
            />
            <AppInput
                class="input_line"
                v-show="form.number != '' && form.region != '' && form.certificate != ''"
                :item="{
                    focus: false,
                    id: 0,
                    placeholder: null,
                    key: 'password',
                    type: 'password',
                    title: 'Пароль для входа',
                    substring: null,
                    required: false,
                    external_link: null,
                    value: form.password,
                }"
                :disabled="false"
                :isUseEnter="false"
                :mask="null"
                :isLink="null"
                :isReadOnly="false"
                @changeValue="(data) => changeValue(data)"
            />
            <AppInput
                class="input_line"
                v-show="form.number != '' && form.region != '' && form.certificate != ''"
                :item="{
                    focus: false,
                    id: 0,
                    placeholder: null,
                    key: 'repeatPassword',
                    type: 'password',
                    title: 'Пароль для входа',
                    substring: null,
                    required: false,
                    external_link: null,
                    value: form.repeatPassword,
                }"
                :disabled="false"
                :isUseEnter="false"
                :mask="null"
                :isLink="null"
                :isReadOnly="false"
                @changeValue="(data) => changeValue(data)"
            />
            <div class="fines__actions">
                <NuxtLink to="/auth?tab=registration">
                    <AppButton class="button_blue" :disabledOption="disabledButton">
                        Проверить штрафы
                    </AppButton>
                </NuxtLink>

                <FansyBox class="fines__fansy-box">
                    <AppButton class="fines__button" :data-fancybox="`finesBlock`" href="">
                        <figure class='ibg fines__icon'>
                            <img src='/icons/youtube_blue.svg' alt='О сервисе'>
                        </figure>
                        О сервисе 
                        <span class="button-text">
                            (1 мин 20 сек)
                        </span>
                    </AppButton>
                </FansyBox>
            </div>
            <div class="fines__politics">
                Нажимая «Проверить штрафы» вы соглашаетесь с политикой обработки персональных данных и принимаете оферту
            </div>
        </form>

        <figure class='ibg fines__image'>
            <img src='/main/fines/preview.webp' alt='Проверьте штрафы и зарегестрируйтесь в 1 клик'>
        </figure>
    </AppSection>
</template>

<script setup>
    import './Fines.scss';
    
    import AppSection from '@/components/AppSection/AppSection.vue';
    import AppH1 from '@/components/AppHeaders/H1/H1.vue'
    import AppInput from '@/components/AppInputs/Input/Input.vue';
    import AppButton from '@/components/AppButton/AppButton.vue';
    import FansyBox from '@/components/AppFansyBox/FansyBox.vue';

    let form = ref({
        number: '',
        region: '',
        certificate: '',
        mail: '',
        password: '',
        repeatPassword: ''
    })

    const disabledButton = computed(() => {
        let txt = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return form.value.password == '' || form.value.repeatPassword == '' || form.value.mail == '' || !txt.test(form.value.mail)
    })

    const changeValue = (data) => {
        form.value[data.key] = data.value
    }
</script>
