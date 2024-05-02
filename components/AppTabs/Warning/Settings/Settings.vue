<template>
    <AppWarning @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            Настройки раздела
        </template>

        <template #body>
            <div class="warning__list">
                <AppInput 
                    class="warning-list__field"
                    :item="{
                        id: 2,
                        required: false,
                        substring: null,
                        type: 'text',
                        title: 'Раздел',
                        placeholder: null,
                        value: settingsTab.title,
                        key: 'title',
                        focus: false
                    }"
                    :isReadOnly="true"
                    :mask="null"
                    :disabled="false"
                    :enabledAutocomplete="false"
                />

                <div class="warning-list__group-field">
                    <AppCheckbox
                        :item="{
                            id: 6,
                            value: settingsTab.has_roles_read,
                            isHTML: false,
                            required: false,
                            title: 'Ограничить редактирование поля',
                            key: 'has_roles_read'
                        }"
                        :disabled="false"
                        @changeValue="(data) => changeValue(data)"
                    />
                    <AppSelect 
                        v-if="settingsTab.has_roles_read"
                        class="warning-list__field"
                        :item="{
                            id: 1,
                            key: 'roles_read',
                            value: settingsTab.roles_read,
                            focus: false,
                            required: false,
                            title: 'Роли',
                            lockedOptions: [],
                            options: userStore.roles
                        }"
                        :isReadOnly="false"
                        :isHaveNullOption="false"
                        :isMultiple="true"
                        :isFiltered="true"
                        @changeValue="(data) => changeValue(data)"
                    />
                </div>
            </div>

            <div class="warning__actions">
                <AppButton class="button_blue" @click="() => emit('callAction', {action: 'saveSettings', value: 'all'})">
                    Сохранить
                </AppButton>
                <AppButton @click="() => showWarning(false)">
                    Отмена
                </AppButton>
            </div>
        </template>
    </AppWarning>
</template>

<script setup>
    import './Settings.scss';
    
    import { inject } from 'vue'

    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppInput from '@/components/AppInputs/Input/Input.vue';
    import AppWarning from '@/components/AppWarning/AppWarning.vue';
    import AppSelect from '@/components/AppSelects/Select/Select.vue';
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue';

    import { useUserStore } from '@/stores/userStore.js'
    const userStore = useUserStore()

    const isShow = inject('isShow')
    const settingsTab = inject('settingsTab')

    const emit = defineEmits([
        'callAction'
    ])

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    }    

    // Изменение значения заголовка
    const changeValue = (data) => {
        settingsTab.value[data.key] = data.value
    }
</script>
