<template>
    <AppWarning @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            {{ isShow.type == 'createRole' ? 'Создание роли' : 'Изменение роли' }}
        </template>

        <template #body>
            <div class="warning__list">
                <div class="warning-list__field">
                    <AppInput 
                        :item="{
                            id: 2,
                            required: false,
                            substring: null,
                            type: 'text',
                            title: 'Имя роли',
                            placeholder: null,
                            value: role.label,
                            key: 'label',
                            focus: false
                        }"
                        :inputLength="50"
                        :isReadOnly="false"
                        :mask="null"
                        :disabled="false"
                        :enabledAutocomplete="false"
                        @changeValue="(data) => changeValue(data)"
                    />
                    <div class="warning-list__field-error" v-if="error.state">
                        {{ error.text }}
                    </div>
                </div>
            </div>

            <div class="warning__actions">
                <AppButton class="button_blue" @click="() => saveSettings()">
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
    
    import { ref, inject, onMounted } from 'vue'

    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppWarning from '@/components/AppWarning/AppWarning.vue';
    import AppInput from '@/components/AppInputs/Input/Input.vue';

    const isShow = inject('isShow')
    const updatedCategory = inject('updatedCategory')
    const categories = inject('categories')
    
    let role = ref({
        label: null    
    })

    let error = ref({
        state: false,
        text: ''
    })

    const emit = defineEmits([
        'callAction'
    ])

    // Изменение значения
    const changeValue = (data) => {
        role.value[data.key] = data.value
    }

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    }    

    // Сохранение настроек
    const saveSettings = () => {
        error.value.state = false 

        if (role.value.label == null || role.value.label.trim() == '') {
            error.value = {
                state: true,
                text: 'Название роли не может быть пустым'
            }
            return
        }


        if (isShow.value.type == 'createRole') {
            emit('callAction', {
                action: 'createRole',
                value: role.value
            })
        } else {
            emit('callAction', {
                action: 'updateRole',
                value: role.value
            })
        }

        isShow.value = {
            state: false,
            type: null
        }
    }

    onMounted(() => {
        if (isShow.value.type == 'updateRole') {
            let findedCategory = categories.value.find(p => p.id == updatedCategory.value.id)

            role.value = {
                id: updatedCategory.value.id,
                label: findedCategory.label
            }
        }
    })
</script>
