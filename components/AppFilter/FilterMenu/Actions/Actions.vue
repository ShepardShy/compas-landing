<template>
    <div class="filter__actions filter-actions">
        <AppPopup :closeByClick="false" :isCanSelect="true">
            <template #summary>
                Выбрать поле
            </template>
            <template #content>
                <PopupOption 
                    v-for="field in fields" 
                    @click="() => changeValue(field)"
                >
                    <AppCheckbox    
                        :item="{
                            id: field.id,
                            value: field.enabled,
                            title: field.title,
                            key: field.key
                        }"
                    />
                </PopupOption>
            </template>
        </AppPopup>


        <div class="filter-actions__buttons"  v-if="editableFilter">
            <AppButton class="button_blue" @click="() => emit('actionSaves', {action: 'save', value: editableFilter})">
                Сохранить
            </AppButton>
            <AppButton @click="() => emit('actionSaves', {action: 'cancel', value: editableFilter})">
                Отмена
            </AppButton>
        </div>
        <div class="filter-actions__buttons" v-else>
            <AppButton class="button_blue" @click="() => emit('actionFilter', {action: 'search', value: null})">
                Найти
            </AppButton>
            <AppButton @click="() => emit('actionFilter', {action: 'clear', value: null})">
                Сбросить
            </AppButton>
        </div>
    </div>
</template>

<script setup>
    import './Actions.scss';
    
    import { inject, computed } from 'vue';

    import AppPopup from '@/components/AppPopup/Popup.vue';
    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    const saves = inject('saves')
    const fields = inject('fields')

    const emit = defineEmits([
        'actionFilter',
        'actionSaves'
    ])

    // Скрытие показ полей
    const changeValue = (field) => {
        emit('actionFilter', {action: 'enabledField', value: {
            value: !field.enabled, 
            key: field.key
        }})
    }

    // Редактируемый фильтр
    const editableFilter = computed(() => {
        return saves.value.find((item) => item.edit)
    })
</script>
