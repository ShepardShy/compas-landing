<template>
    <draggable
        ref="sectionBodyRef"
        v-model="section.fields" 
        class="tile-section__body"
        group="tile-section__body" 
        handle=".tile-section__drag"
        :itemKey="String(section.id)"
        :role="`tile-section_${prefix}`"
        :key="`tile-section_${prefix}`"
        :class="section.fields.length == 0 ? 'tile-section__body_empty' : ''"
        @start="(event) => dragStart(event)"
        @end="(event) => dragEnd(event)"
    >
        <template #item="{ element: field }">
            <div 
                class="tile-section__item" 
                :style="`--textColor: ${field.set_color ? field.color : '#000'}`" 
                :class="setClasses(field)" 
                @click="(event) => editField(event, field)"
                @dragstart="(event) => copyField(event)"
            >
                <IconDrag class="tile-section__drag" v-if="isEditableSettings"/>

                <AppRelation 
                    v-if="field.type == 'relation'"
                    :item="{
                        focus: field.focus,
                        id: field.id,
                        placeholder: null,
                        key: field.key,
                        title: field.title,
                        value: field.value,
                        required: Boolean(field.required),
                        options: ['status', 'relation'].includes(field.type) ? field.options : null,
                        lockedOptions: field.choosed,
                    }"
                    :isCanCreate="true"
                    :isMultiple="Boolean(field.is_plural)"
                    :isReadOnly="Boolean(!field.isEdit || !field.can_edit)"
                    :isHaveLink="field.key != 'role_id'"
                    @changeValue="(data) => changeValue(field.id, data)"
                    @openLink="(data) => openLink({id: data.id, slug: field.related_table})"
                    @showAll="() => openLink({id: field.id, slug: props.slug, tab: field.key, key: field.related_table})"
                    @createOption="() => emit('callAction', {action: 'createOption', value: field.related_table})"
                />
                <AppInput 
                    v-else-if="['number', 'password', 'text'].includes(field.type) && !field.is_plural"
                        :item="{
                            focus: field.focus,
                            id: field.id,
                            placeholder: null,
                            key: field.key,
                            type: field.type,
                            title: field.title,
                            substring: field.unit,
                            required: Boolean(field.required),
                            external_link: [null, undefined].includes(field.value) ? null : typeof field.value == 'object' ? field.value.external_link : null,
                            value: [null, undefined].includes(field.value) ? null : typeof field.value == 'object' ? String(field.value.value) : String(field.value),
                        }"
                        :disabled="false"
                        :isUseEnter="false"
                        :mask="field.mask"
                        :isLink="Boolean(field.is_external_link)"
                        :isReadOnly="Boolean(!field.isEdit || !field.can_edit)"
                        @changeValue="(data) => changeValue(field.id, data)"
                />
                <AppTextarea 
                    v-else-if="field.type == 'text' && field.is_plural"
                    :item="{
                        focus: field.focus,
                        id: field.id,
                        placeholder: null,
                        key: field.key,
                        type: field.type,
                        title: field.title,
                        substring: field.unit,
                        required: Boolean(field.required),
                        external_link: ![null, undefined].includes(field.value) && field.value != '' ? field.value.external_link : null,
                        value: [null, undefined].includes(field.value) ? null : typeof field.value == 'object' ? field.value.value : field.value,
                    }"
                    :disabled="false"
                    :isUseEnter="true"
                    :mask="field.mask"
                    :isLink="Boolean(field.is_external_link)"
                    :isReadOnly="Boolean(!field.isEdit || !field.can_edit)"
                    @changeValue="(data) => changeValue(field.id, data)"
                />
                <AppStatus 
                    v-else-if="field.type == 'status'"
                    :item="{
                        focus: field.focus,
                        id: field.id,
                        key: field.key,
                        title: field.title,
                        options: field.options,
                        value: field.value,
                        required: Boolean(field.required),
                    }"
                    :isCanCreate="true"
                    :isCanSave="true"
                    :isHaveNullOption="false"
                    :isReadOnly="Boolean(!field.isEdit || !field.can_edit)"
                    @changeValue="(data) => changeValue(field.id, data)"
                />
                <AppSelect 
                    v-else-if="field.type == 'select_dropdown'"
                    :item="{
                        id: field.id,
                        key: field.key,
                        value: field.value,
                        focus: field.focus,
                        required: Boolean(field.required),
                        title: field.title,
                        options: field.options,
                        lockedOptions: []
                    }"
                    :isReadOnly="Boolean(!field.isEdit || !field.can_edit)"
                    :isHaveNullOption="true"
                    :isMultiple="Boolean(field.is_plural)"
                    :isFiltered="true"
                    @changeValue="(data) => changeValue(field.id, data)"
                />
                <AppFile 
                    v-else-if="field.type == 'file'"
                    :item="{
                        id: field.id,
                        title: field.title,
                        key: field.key,
                        required: Boolean(field.required),
                        buttonName: null,
                        value: field.value
                    }"
                    :isReadOnly="Boolean(!field.isEdit || !field.can_edit)"
                    :isShowFileName="Boolean(field.show_file_name)"
                    :isMultiple="true"
                    :isOneFile="false"
                    @changeValue="(data) => changeValue(field.id, data)"
                />
                <AppDate 
                    v-else-if="field.type == 'date'"
                    :item="{
                        id: field.id,
                        required: Boolean(field.required),
                        title: field.title,
                        placeholder: null,
                        value: field.value,
                        key: field.key,
                        focus: field.focus
                    }"
                    :isMultiple="Boolean(field.is_plural)"
                    :isReadOnly="Boolean(!field.isEdit || !field.can_edit)"
                    @changeValue="(data) => changeValue(field.id, data)"
                />
                <AppInputGroup 
                    v-if="field.type == 'text_group'"
                    :item="{
                        id: field.id,
                        required: Boolean(field.required),
                        substring: field.id,
                        type: 'text',
                        title: field.title,
                        placeholder: null,
                        value: null,
                        key: field.key,
                        focus: field.focus,
                        subfields: field.subfields
                    }"
                    :isReadOnly="Boolean(!field.isEdit || !field.can_edit)"
                    @changeValue="(data) => changeValue(field.id, data)"
                />
                <AppMap
                    v-if="field.type == 'address'"
                    :item="{
                        id: field.id,
                        title: field.title,
                        key: field.key,
                        required: Boolean(field.required),
                        focus: field.focus,
                        value: field.value,
                        options: field.options ?? [],
                        lockedOptions: []
                    }"
                    :isReadOnly="Boolean(!field.isEdit || !field.can_edit)"
                    :isShowMap="true"
                    :isCanSelect="false"
                    :isShowLabel="true"
                    @changeValue="(data) => changeValue(field.id, data)"
                />
                <AppPopup class="tile-section__settings" :isCanSelect="false" :closeByClick="true" v-if="isEditableSettings">
                    <template #summary>
                        <IconSettings />
                    </template>
                    <template #content>
                        <PopupOption
                            @click="() => emit('callAction', {
                                action: 'editSettings', 
                                value: field
                            })"
                        >
                            Настроить
                        </PopupOption>
                        <PopupOption>
                            <AppCheckbox 
                                :item="{
                                    id: field.id,
                                    value: field.visible_always,
                                    isHTML: false,
                                    required: false,
                                    title: 'Показывать всегда',
                                    key: 'visible_always'
                                }"
                                @changeValue="(data) => updateField(field.id, {
                                    visible_always: data.value
                                })"
                            />
                        </PopupOption>
                        <PopupOption 
                            @click="() => emit('callAction', {
                                action: 'changeVisibleField', 
                                value: {
                                    state: 'hidden',
                                    field: field
                                }
                            })"
                        >
                            Скрыть
                        </PopupOption>
                        <PopupOption 
                            v-if="!field.is_permanent"
                            class="popup__option_red" 
                            @click="() => emit('callAction', {
                                action: 'initDelete', 
                                value: field
                            })"
                        >
                            Удалить
                        </PopupOption>
                    </template>
                </AppPopup>
                <AppInput 
                    v-if="['number', 'password', 'text'].includes(field.type) && Boolean(field.isEdit && field.can_edit) && field.is_external_link"
                    :item="{
                        focus: false,
                        type: 'text',
                        key: 'external_link',
                        substring: null,
                        required: false,
                        placeholder: null,
                        id: field.id,
                        external_link: null,
                        title: 'Внешняя ссылка',
                        value: [null, undefined].includes(field.value) ? '' : typeof field.value == 'object' ? field.value.external_link : '',
                    }"
                    :disabled="false"
                    :isUseEnter="false"
                    :mask="null"
                    :isLink="false"
                    :isReadOnly="false"
                    @changeValue="(data) => changeValue(field.id, data)"
                />
            </div>
        </template>
    </draggable>
</template>

<script setup>
    import './Body.scss';

    import { inject } from 'vue';

    import draggable from 'vuedraggable'
    
    import AppPopup from '@/components/AppPopup/Popup.vue';
    import IconDrag from '@/components/AppIcons/Drag/Drag.vue';
    import IconSettings from '@/components/AppIcons/Settings/Settings.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    import AppDate from '@/components/AppInputs/Date/Date.vue'
    import AppFile from '@/components/AppInputs/File/File.vue'
    import AppInput from '@/components/AppInputs/Input/Input.vue';
    import AppStatus from '@/components/AppSelects/Status/Status.vue'
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import AppMap from '@/components/AppInputs/Map/Map.vue';
    import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue"
    import AppTextarea from "@/components/AppInputs/Textarea/Textarea.vue"
    import AppRelation from "@/components/AppSelects/Relation/Relation.vue"
    import AppInputGroup from '@/components/AppInputs/InputGroup/InputGroup.vue';

    const prefix = ref(0)
    const sectionBodyRef = ref(null)
    const section = inject('section')
    const isEditableSettings = inject('isEditableSettings')

    const props = defineProps({
        slug: {
            default: null,
            type: String
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    // Начало переноса поля
    const dragStart = (event) => {
        event.from.classList.add('tile-section__body_dragging')
    }

    // Копирование секции
    const copyField = (event) => {
        let parentElem = document.createElement("div")
        let elem = event.target.cloneNode(true)
        parentElem.appendChild(elem)
        parentElem.id = "clone-elem";
        parentElem.classList.add('clone-elem')
        parentElem.classList.add('tile-section__body')
        elem.style.width = `${ event.target.offsetWidth}px`
        document.body.appendChild(parentElem);
        event.dataTransfer.setDragImage(parentElem, 5, 8);
    }

    // Конец переноса поля
    const dragEnd = (event) => {
        let fields = []

        for (let i = 0; i < event.to.__draggable_component__.modelValue.length; i++) {
            fields.push({
                id: event.to.__draggable_component__.modelValue[i].id,
                sort: i
            })
        }
        
        event.from.classList.remove('tile-section__body_dragging')
        prefix.value++
        document.querySelectorAll('#clone-elem').forEach(element => {
            element.remove()
        });

        emit('callAction', {
            action: 'changeOrder',
            value: {
                fields: fields,
                id: event.item._underlying_vm_.id,
                section_id: Number(event.to.__draggable_component__.itemKey),
                sections: {
                    from: {
                        id: event.from.__draggable_component__.itemKey,
                        fields: event.from.__draggable_component__.modelValue
                    },
                    to: {
                        id: event.to.__draggable_component__.itemKey,
                        fields: event.to.__draggable_component__.modelValue
                    }
                }
            },
        })
    }

    // Установка класса для отображения всегда
    const setClasses = (field) => {
        if (!field.isEdit && !field.visible_always) {
            if (field.is_external_link) {
                return [null, undefined].includes(field.value) || field.value == '' || field.value.value == '' || field.value.value == null ? 'tile-section__item_hidden' : ''
            } else {
                if (Array.isArray(field.value)) {
                    return field.value.length == 0 ? 'tile-section__item_hidden' : ''
                } else {
                    if (field.type == 'text_group') {
                        return field.subfields.filter(subfield => subfield.value != null && subfield.value != '').length == 0 ? 'tile-section__item_hidden' : ''
                    } else if (field.type == 'relation') {
                        return field.value == null || field.value.value.length == 0 ? 'tile-section__item_hidden' : ''
                    } else {
                        return [null, undefined].includes(field.value) || field.value == '' ? 'tile-section__item_hidden' : ''
                    }
                }
            }
        }
    }

    // Редактирование поля
    const editField = (event, field) => {
        let regexp = /<\/?[a-z][\s\S]*>/i
        if (field.can_edit && !field.isEdit && !['svg'].includes(event.target.tagName) && regexp.test(event.target.innerHTML)) {
            field.isEdit = true
            field.focus = true

            if (!section.value.state) {
                section.value.state = true
            }
            emit('callAction', {
                action: 'editField',
                value: field
            })
        }
    }

    // Изменение значения
    const changeValue = (id, data) => {
        let findedField = section.value.fields.find(field => field.id == id)
        if (!findedField.isEdit) {
            section.value.state = true
            findedField.isEdit = true

            emit('callAction', {
                action: 'editField',
                value: findedField
            })
        }

        if (data.key == 'external_link') {
            if (findedField.value == null ) {
                findedField.value = {
                    external_link: data.value,
                    value: ''
                }
            } else if (typeof findedField.value != 'object') {
                let newValue = toRaw({
                    external_link: data.value,
                    value: findedField.value
                })
                
                findedField.value = newValue
            } else {
                findedField.value.external_link = data.value
            }
        } else if (findedField.type == 'text_group') {
            findedField.subfields = data
        } else {
            if (['text'].includes(findedField.type) && !findedField.is_plural) {
                if (findedField.value == null || typeof findedField.value != 'object') {
                    findedField.value = {
                        external_link: '',
                        value: data.value
                    }
                }  else {
                    findedField.value.value = data.value
                }
            } else {
                findedField.value = data.value
            }
        }
    }

    // Открытие ссылок
    const openLink = (value) => {
        emit('callAction', {
            action: 'showModal',
            value: {
                id: value.id,
                slug: value.slug,
                tab: [null, undefined].includes(value.tab) ? null : value.tab,
                key: [null, undefined].includes(value.key) ? null : value.key
            }
        })
    }

    // Изменение настроек
    const updateField = (id, data) => {
        let findedField = section.value.fields.find(field => field.id == id)
        data.id = id

        for (let item in data) {
            findedField[item] = data[item]
        }


        emit('callAction', {
            action: 'updateField',
            value: data
        })
    }
</script>
