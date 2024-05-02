<template>
    <FormItem
        class="form-item__autocomplete autocomplete"
        :required="props.item.required"
    >
        <FormLabel
            v-show="props.item.title != null && props.item.title != ''"
            :title="props.item.title"
        />

        <AppPopup
            ref="popupRef"
            class="autocomplete__popup"
            :isHaveParent="true"
            :closeByClick="false"
            :isReadOnly="props.isReadOnly"
            :isCanSelect="true"
            @clickOutside="() => emit('clickOutside', true)"
            @click="(event) => preventClick(event)"
        >
            <template #summary>
                <slot name="icon"></slot>
                <AppInput
                    :item="{
                        id: props.item.id,
                        title: null,
                        type: 'text',
                        focus: false,
                        key: props.item.key,
                        placeholder: null,
                        value: props.isReadOnly ? (activeOption.text == 'Не выбрано' && props.item.type == 'address') ? null : activeOption.text : search,
                        substring: props.isReadOnly ? null : activeOption.id == null ? ' ' : `ID: ${activeOption.id}`
                    }"
                    :mask="null"
                    :disabled="false"
                    :isLink="props.isLink"
                    :isReadOnly="props.isReadOnly"
                    :enabledAutocomplete="false"
                    @openLink="(item) => emit('openLink', item)"
                    @changeValue="(data) => callAction({action: 'searchOptions', value: data.value})"
                    @mousedown="(event) => props.isReadOnly ? null : event.target.classList.contains('popup_prevent') ? event.preventDefault() : null"
                >
                    <slot name="link"></slot>
                    <div class="autocomplete__active-option" v-show="!props.isReadOnly && ([null, undefined].includes(search) || search == '')">
                        {{ activeOption.text }}
                    </div>
                </AppInput>
            </template>
            <template #content>
                <PopupOption @click="() => callAction({action: 'changeValue', value: null})">
                    Не выбрано
                </PopupOption>
                <PopupOption
                    class="popup-option__root"
                    v-for="option in options"
                    :class="option.value == activeOption.id ? 'popup__option_active' : '', ![null, undefined].includes(props.item.lockedOptions) && props.item.lockedOptions.includes(option.value) ? 'popup__option_disabled' : ''"
                    @click="() => callAction({action: 'changeValue', value: option.value})"
                >
                    <div class="popup-option__text">
                        {{ option.label.text }}
                    </div>

                    <span class="popup-option__substring" v-show="props.isShowId">
                        ID: {{ option.label.id }}
                    </span>
                </PopupOption>
                <PopupOption v-if="isCanCreate" class="popup__option_create" @click="() => callAction({action: 'createOption', value: true})">
                    Создать
                </PopupOption>
            </template>
        </AppPopup>
    </FormItem>
</template>

<script setup>
    import './Input.scss';

    import { ref, onMounted, watch } from 'vue'

    import _ from 'lodash'
    import AppPopup from '@/components/AppPopup/Popup.vue';
    import AppInput from '@/components/AppInputs/Input/Input.vue';
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';
    import PopupScripts from '@/components/AppPopup/Scripts.js';

    const popupRef = ref(null)
    const nullOption = {
        id: null,
        sort: 0,
        text: "Не выбрано"
    }
    let activeOption = ref(nullOption)
    let search = ref(null)
    let options = ref([])
    let backupOptions = ref([])

    const props = defineProps({
        item: {
            default: {
                id: 0,
                required: false,
                title: 'Autocomlete title',
                value: null,
                placeholder: null,
                focus: false,
                key: null,
                options: [],
                lockedOptions: []
            },
            type: Object
        },
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isCanCreate: {
            default: false,
            type: Boolean
        },
        isLink: {
            default: false,
            type: Boolean
        },
        isShowId: {
            default: false,
            type: Boolean
        },
        anotherTitle: {
            default: null,
            type: String
        }
    })

    const emit = defineEmits([
        'openLink',
        'changeValue',
        'createOption',
        'clickOutside',
        'searchOptions',
    ])

    // Превент клика при нажатии на блок
    const preventClick = (event) => {
        if (props.isReadOnly || event.target.closest('.popup_prevent') != null) {
            event.preventDefault()
            popupRef.value.popupRef.removeAttribute('open')
        } else {
            if (event.target.closest('.form-item__substring') == null) {
                popupRef.value.popupRef.setAttribute('open', true)
            } else {
                event.preventDefault()
                if (popupRef.value.popupRef.hasAttribute('open')) {
                    popupRef.value.popupRef.removeAttribute('open')
                }  else {
                    popupRef.value.popupRef.setAttribute('open', true)
                }
            }
        } 
    }

    // Действия с автокомплитом
    const callAction = (data) => {
        // Получение опций
        const getOptions = () => {
            // Проверка на пустой объект
            const isEmpty = (obj) => {
                for (const prop in obj) {
                    if (Object.hasOwn(obj, prop)) {
                        return false;
                    }
                }
                return true;
            }

            let localOptions = props.item.options == null ? [] : props.item.options.filter(p => p != null && typeof p == 'object' && !Array.isArray(p) && !isEmpty(p)).sort((prev, next) => prev.label.sort - next.label.sort)
            options.value = JSON.parse(JSON.stringify(localOptions))
        }

        // Создание опции
        const createOption = () => {
            PopupScripts.hideDetails(popupRef.value.popupRef)
            emit('createOption', {
                key: props.item.key,
                value: true
            })
        }

        // Установка выбранной опции
        const setActiveOption = (value) => {
            search.value = ''
            let findedOption = options.value == null ? null : options.value.find(option => _.isEqual(option.value, value))
            if ([null, undefined].includes(findedOption)) {
                activeOption.value = nullOption
            } else {
                activeOption.value = findedOption.label
                search.value = findedOption.label.text
            }
        }

        // Поиск опций
        const searchOptions = (value) => {
            search.value = value
            emit('searchOptions', {key: props.item.key, value: search.value})
        }

        // Изменить значение поля
        const changeValue = (value) => {
            if (value == null || (![null, undefined].includes(props.item.lockedOptions) && !props.item.lockedOptions.includes(value) || props.item.type == 'address')) {
                search.value = null
                options.value = backupOptions.value
                setActiveOption(value)
                emit('changeValue', {
                    key: props.item.key,
                    value: value
                })

                setTimeout(() => {
                    PopupScripts.hideDetails(popupRef.value.popupRef)
                }, 10);
            }
        }

        switch (data.action) {
            // Создание опции
            case 'createOption':
                createOption()
                break;

            // Установка выбранной опции
            case 'setActiveOption':
                setActiveOption(data.value)
                break;

            // Поиск опций
            case 'searchOptions':
                searchOptions(data.value)
                break;

            // Изменить значение поля
            case 'changeValue':
                changeValue(data.value)
                break;

            // Получение опций
            case 'getOptions':
                getOptions()
                break;
            default:
                break;
        }
    }

    onMounted(() => {
        callAction({
            action: 'getOptions',
            value: null
        })
        backupOptions.value = JSON.parse(JSON.stringify(options.value))
        callAction({
            action: 'setActiveOption',
            value: props.item.value
        })

        if (![null, undefined].includes(props.anotherTitle) && typeof props.anotherTitle == 'string' && props.anotherTitle != '') {
            search.value = props.anotherTitle == null ? null : props.anotherTitle
        } else {
            search.value = activeOption.value.id == null ? null : activeOption.value.text
        }
    })

    watch(() => props.item.options, () => {
        callAction({
            action: 'getOptions',
            value: null
        })
    })

    watch(() => props.item.value, () => {
        callAction({
            action: 'getOptions',
            value: null
        })
        callAction({
            action: 'setActiveOption',
            value: props.item.value
        })
    })

    defineExpose({
        popupRef
    })
</script>
