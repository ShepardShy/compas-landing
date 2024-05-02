<template>
    <div class="filter__saves">
        <div class="filter__subtitle">
            Сохраненные
        </div>

        <div class="filter__saves-list">
            <div 
                class="filter__save filter-save" 
                v-for="(item, index) of saves.filter(p => !p.is_hidden)" 
                :class="item.edit ? 'filter-save_edit' : ''"
            >
                <div 
                    class="filter-save__title" 
                    v-show="!item.edit" 
                    @click="() => $emit('actionSaves', {action: 'changeActiveFilter', value: item})"
                >
                    {{ item.title }}
                </div>
                <AppInput 
                    v-show="item.edit"
                    :item="{
                        id: item.id,
                        key: item.id,
                        value: item.title,
                        placeholder: 'Пусто',
                        focus: item.edit
                    }"
                    :enabledAutocomplete="false"
                    @changeValue="(data) => changeValue(data)"
                />
                <AppPopup class="filter-save__actions" :closeByClick="true" :isCanSelect="false">
                    <template #summary>
                        <IconDots />
                    </template>
                    <template #content>
                        <PopupOption 
                            v-for="option in setPopupActions(index)" 
                            :class="option.class"
                            @click="() => emit('actionSaves', {action: option.action, value: item})"
                        >
                            {{ option.title }}
                        </PopupOption>
                    </template>
                </AppPopup>
            </div>
        </div>

        <ButtonText class="filter__button-save" @click="() => $emit('actionSaves', {action: 'initCreate', value: null})">
            + Добавить фильтр
        </ButtonText>
    </div>
</template>

<script setup>
    import './Saves.scss';

    import ButtonText from '@/components/AppButton/ButtonText/ButtonText.vue';
    import IconDots from '@/components/AppIcons/Dots/Dots.vue';
    import AppInput from '@/components/AppInputs/Input/Input.vue';
    import AppPopup from '@/components/AppPopup/Popup.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    const saves = inject('saves')

    const emit = defineEmits([
        'actionSaves'
    ])

    // Кнопки
    const popupActions = [
        {
            id: 0,
            action: 'up',
            title: 'Вверх',
            class: null
        },
        {
            id: 1,
            action: 'down',
            title: 'Вниз',
            class: null
        },
        {
            id: 2,
            action: 'edit',
            title: 'Редактировать',
            class: null
        },
        {
            id: 3,
            action: 'delete',
            title: 'Удалить',
            class: 'popup__option_red'
        },
    ]

    // Отображение кнопок в экшенах
    const setPopupActions = (index) => {
        if (index == 0) {
            return popupActions.filter(p => p.action != 'up')
        } else if (index == saves.value.length - 2) {
            return popupActions.filter(p => p.action != 'down')
        } else {
            return popupActions
        }
    }

    // Изменение заголовка
    const changeValue = (data) => {
        let findedFitler = saves.value.find(item => item.id == data.key)
        findedFitler.title = data.value
    }
</script>