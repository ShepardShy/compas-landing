<template>
    <div class="warning__list warning-list">
        <AppSelect 
            class="warning-list__field"
            :item="{
                id: 0,
                key: 'type',
                value: edittingField.type ,
                focus: false,
                required: false,
                title: 'Тип поля',
                lockedOptions: [],
                options: isShow.type == 'settings' ? SettingsOptions.types : SettingsOptions.types.filter(p => !['relation', 'address'].includes(p.value))
            }"
            :isReadOnly="isShow.type == 'settings'"
            :isHaveNullOption="false"
            :isMultiple="false"
            :isFiltered="true"
            @changeValue="(data) => changeValue(data)"
        />

        <AppSelect 
            class="warning-list__field"
            :item="{
                id: 1,
                key: 'section_id',
                value: edittingField.section_id,
                focus: false,
                required: false,
                title: 'Раздел',
                lockedOptions: [],
                options: props.sections
            }"
            :isReadOnly="false"
            :isHaveNullOption="false"
            :isMultiple="false"
            :isFiltered="true"
            @changeValue="(data) => changeValue(data)"
        />

        <AppInput 
            class="warning-list__field"
            :item="{
                id: 2,
                required: true,
                substring: null,
                type: 'text',
                title: 'Название поля',
                placeholder: null,
                value: edittingField.title,
                key: 'title',
                focus: false
            }"
            :isReadOnly="edittingField.permanent_name"
            :mask="null"
            :disabled="false"
            :enabledAutocomplete="false"
            @changeValue="(data) => changeValue(data)"
        />

        <AppInput 
            v-show="edittingField.type == 'number'"
            class="warning-list__field"
            :item="{
                id: 3,
                required: false,
                substring: null,
                type: 'text',
                title: 'Единица измерения',
                placeholder: null,
                value: edittingField.unit,
                key: 'unit',
                focus: false
            }"
            :isReadOnly="false"
            :mask="null"
            :disabled="false"
            :enabledAutocomplete="false"
            @changeValue="(data) => changeValue(data)"
        />
    </div>

    <div class="warning__list warning-list warning__list_other" v-if="edittingField.type == 'file'">
        <AppInput 
            class="warning-list__field"
            :item="{
                id: 3,
                required: false,
                substring: null,
                type: 'text',
                title: 'Название кнопки',
                placeholder: null,
                value: edittingField.button_name,
                key: 'button_name',
                focus: false
            }"
            :isReadOnly="false"
            :mask="null"
            :disabled="false"
            :enabledAutocomplete="false"
            @changeValue="(data) => changeValue(data)"
        />
    </div>
    
    <div class="warning__list warning-list warning__list_other warning__list_options" v-else-if="['text_group', 'select_dropdown'].includes(edittingField.type)">
        <div class="warning-list__subtitle">
            Сохраненные элементы
        </div>
        <div class="warning-list__field" v-for="(field, index) in edittingField.options">
            <AppInput 
                :item="{
                    id: index,
                    required: false,
                    substring: null,
                    type: 'text',
                    title: null,
                    placeholder: null,
                    value: field.label,
                    key: 'optionsSelect',
                    focus: false
                }"
                :isReadOnly="false"
                :mask="null"
                :disabled="false"
                :enabledAutocomplete="false"
                @changeValue="(data) => changeValue({
                    id: index,
                    key: data.key,
                    value: data.value
                })"
            />
            <IconDelete 
                @click="changeValue({
                    key: 'optionDelete',
                    id: index
                })"
            />
        </div>

        <div class="warning__list-empty" v-show="edittingField.options.length == 0">
            Пусто
        </div>

        <ButtonText 
            @click="changeValue({ key: 'addOptionSelect' })"
        >
            Добавить
        </ButtonText>
    </div>

    <div class="warning__list warning-list warning__list_other warning__list_settigns-statuses warning__list_options" v-else-if="['status'].includes(edittingField.type)">
        <div class="warning-list__subtitle">
            Сохраненные элементы
        </div>
        <div class="warning-list__field" v-for="(field, index) in options">
            <div class="settings-status">
                <AppPopup class="settings-status__popup" :isCanSelect="true">
                    <template #summary> 
                        <div class="settings-status__summary" :style="`--statusColor: ${field.label.color};`">
                            <IconPipette />
                        </div>
                    </template>
                    <template #content>
                        <PopupOption class="popup__option_unhover">
                            <AppColorpicker 
                                :color="field.label.color"
                                @changeColor="(data) => changeValue({
                                    key: 'optionsColor',
                                    id: index,
                                    value: data.cssColor
                                })"
                            />
                        </PopupOption>
                    </template>
                </AppPopup>

                <AppFile 
                    :item="{
                        id: 0,
                        title: '',
                        key: 'optionsIcon',
                        required: false,
                        buttonName: null,
                        value: [field.label]
                    }"
                    :isReadOnly="false"
                    :isShowFileName="false"
                    :isMultiple="false"
                    :isOneFile="false"
                    :isIcon="true"
                    @changeValue="(data) => changeValue({
                        key: 'optionsIcon',
                        id: index,
                        value: data.value[1]
                    })"
                />
                <AppInput 
                    :item="{
                        id: index,
                        required: false,
                        substring: null,
                        type: 'text',
                        title: null,
                        placeholder: null,
                        value: field.label.text,
                        key: 'optionsTitle',
                        focus: false
                    }"
                    :isReadOnly="false"
                    :mask="null"
                    :disabled="false"
                    :enabledAutocomplete="false"
                    @changeValue="(data) => changeValue({
                        id: index,
                        key: 'optionsTitle',
                        value: data.value
                    })"
                />
            </div>
            <IconDelete 
                @click="changeValue({
                    key: 'optionDelete',
                    id: index
                })"
            />
        </div>

        <div class="warning__list-empty" v-show="edittingField.options.length == 0">
            Пусто
        </div>

        <ButtonText @click="changeValue({ key: 'addOptionStatus' })">
            Добавить
        </ButtonText>
    </div>

    <div class="warning__list warning__list_checkboxes">
        <AppCheckbox 
            v-if="['text', 'select_dropdown'].includes(edittingField.type)"
            :item="{
                id: 5,
                value: edittingField.is_plural,
                isHTML: false,
                required: false,
                title: 'Множественное',
                key: 'is_plural'
            }"
            :disabled="isShow.type == 'settings'"
            @changeValue="(data) => changeValue(data)"
        />
        <AppCheckbox 
            :item="{
                id: 5,
                value: edittingField.required,
                isHTML: false,
                required: false,
                title: 'Обязательное поле',
                key: 'required'
            }"
            :disabled="edittingField.permanent_required"
            @changeValue="(data) => changeValue(data)"
        />
        <AppCheckbox 
            :item="{
                id: 5,
                value: edittingField.visible_always,
                isHTML: false,
                required: false,
                title: 'Показывать всегда',
                key: 'visible_always'
            }"
            :disabled="false"
            @changeValue="(data) => changeValue(data)"
        />
        <AppCheckbox
            v-if="['text'].includes(edittingField.type)"
            :item="{
                id: 5,
                value: edittingField.is_external_link,
                isHTML: false,
                required: false,
                title: 'Внешняя ссылка',
                key: 'is_external_link'
            }"
            :disabled="false"
            @changeValue="(data) => changeValue(data)"
        />

        <div class="warning-list__group-field">
            <AppCheckbox
                :item="{
                    id: 6,
                    value: edittingField.has_roles_read,
                    isHTML: false,
                    required: false,
                    title: 'Ограничить видимость поля',
                    key: 'has_roles_read'
                }"
                :disabled="false"
                @changeValue="(data) => changeValue(data)"
            />
            <AppSelect 
                v-if="edittingField.has_roles_read"
                class="warning-list__field"
                :item="{
                    id: 1,
                    key: 'roles_read',
                    value: edittingField.roles_read,
                    focus: false,
                    required: false,
                    title: 'Роли',
                    lockedOptions: [],
                    options: []
                }"
                :isReadOnly="false"
                :isHaveNullOption="false"
                :isMultiple="true"
                :isFiltered="true"
                @changeValue="(data) => changeValue(data)"
            />

        </div>

        <div class="warning-list__group-field">
            <AppCheckbox
                :item="{
                    id: 6,
                    value: edittingField.has_roles_write,
                    isHTML: false,
                    required: false,
                    title: 'Ограничить редактирование поля',
                    key: 'has_roles_write'
                }"
                :disabled="false"
                @changeValue="(data) => changeValue(data)"
            />
            <AppSelect 
                v-if="edittingField.has_roles_write"
                class="warning-list__field"
                :item="{
                    id: 1,
                    key: 'roles_write',
                    value: edittingField.roles_write,
                    focus: false,
                    required: false,
                    title: 'Роли',
                    lockedOptions: [],
                    options: []
                }"
                :isReadOnly="false"
                :isHaveNullOption="false"
                :isMultiple="true"
                :isFiltered="true"
                @changeValue="(data) => changeValue(data)"
            />
        </div>

        <AppCheckbox
            v-if="edittingField.type == 'file'"
            :item="{
                id: 6,
                value: edittingField.show_file_name,
                isHTML: false,
                required: false,
                title: 'Показывать название файлов',
                key: 'show_file_name'
            }"
            :disabled="false"
            @changeValue="(data) => changeValue(data)"
        />
        
        <AppPopup 
            class="settings__popup" 
            :isCanSelect="true" 
            v-if="['text', 'number'].includes(edittingField.type)" 
            @click="() => openColorPicker(true)"
            @clickOutside="() => openColorPicker(false)"
        >
            <template #summary> 
                <AppCheckbox
                    :item="{
                        id: 6,
                        value: edittingField.set_color,
                        isHTML: false,
                        required: false,
                        title: 'Выбрать цвет',
                        key: 'set_color'
                    }"
                    :changeValueLabel="false"
                    :disabled="false"
                    :style="`--textColor: ${edittingField.color};`"
                    @changeValue="(data) => changeValue(data)"
                />
            </template>
            <template #content>
                <PopupOption class="popup__option_unhover">
                    <AppColorpicker 
                        :color="[null, undefined].includes(edittingField.color) ? '#000' : edittingField.color"
                        @changeColor="(data) => changeValue({
                            key: 'color',
                            value: data.cssColor
                        })"
                    />
                </PopupOption>
            </template>
        </AppPopup>
    </div>
</template>

<script setup>
    import './Options.scss';

    import { inject } from 'vue'
    import SettingsOptions from './Settings.json'

    import IconDelete from '@/components/AppIcons/Delete/Delete.vue';
    import IconPipette from '@/components/AppIcons/Pipette/Pipette.vue';

    import AppPopup from '@/components/AppPopup/Popup.vue';
    import AppFile from '@/components/AppInputs/File/File.vue';
    import AppInput from '@/components/AppInputs/Input/Input.vue';
    import AppSelect from '@/components/AppSelects/Select/Select.vue';
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue';
    import AppColorpicker from '@/components/AppColorPicker/ColorPicker.vue';
    import ButtonText from '@/components/AppButton/ButtonText/ButtonText.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';
    
    const isShow = inject('isShow')
    const warningRef = inject('warningRef')
    const changedKeys = inject('changedKeys')
    const edittingField = inject('edittingField')
    
    const props = defineProps({
        sections: {
            default: [],
            type: Array
        }
    })

    // Открыть колорпикер
    const openColorPicker = (status) => {
        if (status) {
            warningRef.value.warningRef.classList.add('warning_disabled-select')
        } else {
            warningRef.value.warningRef.classList.remove('warning_disabled-select')
        }
    }

    // Изменение значения
    const changeValue = (data) => {
        let localOptions = edittingField.value.options ? edittingField.value.options : []

        switch (data.key) {
            // Изменение цвета у опции статуса
            case "optionsColor":
                localOptions.filter(p => !p.label.is_hidden)[data.id].label.color = data.value
                changedKeys.value.options = edittingField.value.options
                break;
                
            // Изменение иконки у опции статуса
            case "optionsIcon":
                localOptions.filter(p => !p.label.is_hidden)[data.id].label.file = [null, undefined].includes(data.value) ? null : data.value.url
                changedKeys.value.options = edittingField.value.options
                break;
                
            // Изменение заголовка у опции статуса
            case "optionsTitle":
                localOptions.filter(p => !p.label.is_hidden)[data.id].label.text = data.value
                changedKeys.value.options = edittingField.value.options
                break;
                
            // Удаление опции
            case "optionDelete":
                edittingField.value.options.splice(data.id, 1);
                changedKeys.value.options = edittingField.value.options
                break;
                
            // Изменение заголовка в опциях селекта
            case "optionsSelect":
                edittingField.value.options[data.id].label = data.value
                changedKeys.value.options = edittingField.value.options
                break;
                
            // Добавление опции в селект
            case "addOptionSelect":
                edittingField.value.options.push({
                    value: edittingField.value.options.length,
                    label: null
                })
                changedKeys.value.options = edittingField.value.options
                break;
                
            // Добавление опции в статус
            case "addOptionStatus":
                edittingField.value.options.push({
                    label: {
                        id: null,
                        file: null,
                        is_hidden: 0,
                        color: '#b6b6b6',
                        text: null
                    },
                    value: edittingField.value.options.length
                })
                break;

            case "type":
                edittingField.value[data.key] = data.value

                if (edittingField.value.type == 'status') {
                    edittingField.value.options = [
                        {
                            label: {
                                id: null,
                                file: null,
                                is_hidden: 0,
                                color: '#b6b6b6',
                                text: null
                            },
                            value: 0
                        },
                        {
                            label: {
                                id: null,
                                file: null,
                                is_hidden: 0,
                                color: '#b6b6b6',
                                text: null
                            },
                            value: 1
                        },
                        {
                            label: {
                                id: null,
                                file: null,
                                is_hidden: 0,
                                color: '#b6b6b6',
                                text: null
                            },
                            value: 2
                        }
                    ]
                } else if (['text_group', 'select_dropdown'].includes(edittingField.value.type)) {
                    edittingField.value.options =  [
                        {
                            label: null,
                            value: 0
                        },
                        {
                            label: null,
                            value: 1
                        },
                        {
                            label: null,
                            value: 2
                        }
                    ]
                } else {
                    edittingField.value.options = []
                }
                
                break;
                
            default:
                edittingField.value[data.key] = data.value
                changedKeys.value[data.key] = data.value
                break;
        }
    }

    const options = computed(() => {
        return edittingField.value.options ? edittingField.value.options.filter(p => !p.label.is_hidden) : []
    })
</script>
