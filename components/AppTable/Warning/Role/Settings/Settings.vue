<template>
    <AppWarning @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            {{ isShow.type == 'createRole' ? 'Создание роли' : 'Изменение роли' }}
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
                        title: 'Имя роли',
                        placeholder: null,
                        value: role.label,
                        key: 'label',
                        focus: false
                    }"
                    :isReadOnly="false"
                    :mask="null"
                    :disabled="false"
                    :enabledAutocomplete="false"
                    @changeValue="(data) => changeValue(data)"
                />
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
