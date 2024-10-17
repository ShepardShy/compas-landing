<template>
    <AppWarning @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            {{ isShow.type == 'createCategory' ? 'Создание категории' : 'Изменение категории' }}
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
                            title: 'Название категории',
                            placeholder: null,
                            value: category.name,
                            key: 'name',
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

                <AppSelect 
                    class="warning-list__field"
                    :item="{
                        id: 1,
                        key: 'parent_id',
                        value: category.parent_id,
                        focus: false,
                        required: false,
                        title: 'Расположение категории',
                        lockedOptions: [],
                        options: localCategories
                    }"
                    :isReadOnly="false"
                    :isHaveNullOption="false"
                    :isMultiple="false"
                    :isFiltered="true"
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
    import AppSelect from '@/components/AppSelects/Select/Select.vue';
    import AppInput from '@/components/AppInputs/Input/Input.vue';

    const isShow = inject('isShow')
    const categories = inject('categories')
    const updatedCategory = inject('updatedCategory')
    
    const localCategories = ref([])

    let error = ref({
        state: false,
        text: ''
    })

    let category = ref({
        name: 'Новая категория',
        children: [],
        parent_id: null
    })

    const emit = defineEmits([
        'callAction'
    ])

    // Изменение значения
    const changeValue = (data) => {
        category.value[data.key] = data.value
    }

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    }    

    // Получение списка категорий
    const getCategories = (categories) => {
        let data = []

        for (let category of categories) {
            if (category.children.length > 0) {
                data = data.concat(getCategories(category.children))
            }

            data.push({
                label: category.name,
                children: category.children,
                value: category.id
            })
        }

        return data
    }
    
    // Сохранение настроек
    const saveSettings = () => {
        if (category.value.name == null || category.value.name.trim() == '') {
            error.value = {
                state: true,
                text: 'Название роли не может быть пустым'
            }
            return
        }

        if (isShow.value.type == 'createCategory' || isShow.value.type == 'createSubCategory') {
            emit('callAction', {
                action: 'createCategory',
                value: category.value
            })
        } else {
            emit('callAction', {
                action: 'updateCategory',
                value: category.value
            })
        }

        isShow.value = {
            state: false,
            type: null
        }
    }

    onMounted(() => {
        localCategories.value = getCategories(categories.value).reverse()
        if (isShow.value.type == 'updateCategory' || isShow.value.type == 'createSubCategory') {
            let findedParentCategory = localCategories.value.find(p => p.value == updatedCategory.value.parent_id)
            let findedCategory = localCategories.value.find(p => p.value == updatedCategory.value.id)

            if (isShow.value.type == 'createSubCategory') {
                category.value = {
                    name: 'Новая категория',
                    children: [],
                    parent_id: findedCategory ? findedCategory.value : null
                }
            } else {
                category.value = {
                    id: updatedCategory.value.id,
                    name: findedCategory.label,
                    children: findedCategory.children,
                    parent_id: findedParentCategory ? findedParentCategory.value : null
                }
            }
        }
    })
</script>
