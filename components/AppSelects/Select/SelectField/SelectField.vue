<template>
    <div class="form-item__value form-item__value_multiply" :class="activeOptions == null || activeOptions.length == 0 ? 'form-item__value_empty' : ''" v-if="props.isMultiple && props.isReadOnly">
        <div class="select__active-option-tab" v-for="tab in activeOptions">
            {{ tab.label }}
        </div>
    </div>

    <FormValue 
        v-else-if="props.isReadOnly"
        :value="activeOptions == null || activeOptions.value == null ? null : activeOptions.label"
        :isHTML="false"
        :isLink="false"
    />

    <AppPopup 
        v-else
        class="select__popup" 
        :closeByClick="false" 
        ref="popupRef" 
        :isCanSelect="true"
        :class="props.isMultiple ? 'select__popup_multiply' : ''"
        :isReadOnly="props.isReadOnly"
        @click="(event) =>  props.isReadOnly ? event.preventDefault() : callAction({action: 'showContent', value: true})"
        @clickOutside="() => emit('clickOutside', true)"
    >
        <template #summary> 
            <AppInput
                ref="inputRef"
                :item="{
                    id: props.item.id,
                    title: null,
                    type: 'text',
                    focus: false,
                    key: props.item.key,
                    placeholder: null,
                    value: props.isReadOnly ? activeOptions == null ? null : activeOptions.label : search,
                    substring: props.isReadOnly ? null : ' '
                }"
                :disabled="!props.isFiltered"
                :isReadOnly="props.isReadOnly"
                :enabledAutocomplete="false"
                @changeValue="(data) => callAction({action: 'searchOptions', value: data.value})"
                @keydown.space="(event) => {event.preventDefault(); callAction({action: 'searchOptions', value: event.target.value + ' '})}"
            > 
                <div class="select__active-option active-option" v-show="!props.isReadOnly && (props.isMultiple || ([null, undefined].includes(search) || search == ''))">
                    <template v-if="props.isMultiple && activeOptions != null">
                        <div class="select__active-option-tab" v-for="tab in activeOptions">
                            {{ tab.label }}

                            <IconDelete 
                                @click="(event) => callAction({action: 'changeValue', value: tab.value, event: event})"
                            />
                        </div>

                        <div class="active-option__mirror">
                            <div class="form-item__mirror">
                                {{ search }}
                            </div>
                            <input 
                                ref="mirrorRef" 
                                type="text" 
                                :value="search"
                                :disabled="!props.isFiltered"
                                @input="(e) => callAction({action: 'searchOptions', value: e.target.value})"
                            >
                        </div>
                    </template> 
                    <template v-else>
                        {{ activeOptions == null ? nullOption.label : activeOptions.label }}
                    </template>
                </div>
            </AppInput>
        </template>
        <template #content>
            <PopupOption class="popup__option_null" v-show="props.isHaveNullOption & !props.isMultiple || options.length == 0" @click="() => callAction({action: 'changeValue', value: null})">
                Не выбрано
            </PopupOption>
            <PopupOption 
                class="popup-option__root" 
                v-for="option in options" 
                :class="option.value == activeOptions.value || multiplyValues.includes(option.value) ? 'popup__option_active' : '', ![null, undefined].includes(props.item.lockedOptions) && props.item.lockedOptions.includes(option.value) ? 'popup__option_disabled' : ''" 
                @click="() => callAction({action: 'changeValue', value: option.value})"
            >
                <div class="popup-option__text">
                    {{ option.label }}
                </div>
            </PopupOption>
        </template>
    </AppPopup>
</template>

<script setup>
    import './SelectField.scss';

    import AppPopup from '@/components/AppPopup/Popup.vue';
    import AppInput from '@/components/AppInputs/Input/Input.vue';
    import IconDelete from '@/components/AppIcons/Delete/Delete.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';
    import FormValue from '@/components/AppForm/FormValue/FormValue.vue';
    import PopupScripts from '@/components/AppPopup/Scripts.js';

    const props = defineProps({
        item: {
            default: {
                id: 0,
                required: false,
                title: 'Select title',
                value: null,
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
        isMultiple: {
            default: false,
            type: Boolean
        },
        isHaveNullOption: {
            default: true,
            type: Boolean
        },
        isFiltered: {
            default: false,
            type: Boolean
        }
    })
    
    const emit = defineEmits([
        'changeValue',
        'clickOutside'
    ])
    
    const popupRef = ref(null)
    const inputRef = ref(null)
    const mirrorRef = ref(null)
    const nullOption = {
        label: "Не выбрано",
        value: null
    }

    let options = ref([])
    let search = ref(null)
    let backupOptions = ref([])
    let multiplyValues = ref([])
    let activeOptions = ref(props.isMultiple ? [] : nullOption)

    // Действия с автокомплитом
    const callAction = async (data) => {
        // Открытие/скрытие всплывающего окна
        const showContent = (state) => {
            if (state) {
                setTimeout(() => {
                    if (props.isMultiple) {
                        mirrorRef.value.focus()
                    } else {
                        inputRef.value.inputRef.inputRef.focus()
                    }
                }, 10);
            } else {
                popupRef.value.popupRef.removeAttribute('open')
            }
        }

        // Получение опций
        const getOptions = async () => {
            // Проверка на пустой объект
            const isEmpty = (obj) => {
                for (const prop in obj) {
                    if (Object.hasOwn(obj, prop)) {
                    return false;
                    }
                }
                return true;
            }

            let localOptions = props.item.options == null ? [] : props.item.options.filter(p => p != null && typeof p == 'object' && !Array.isArray(p) && !isEmpty(p))
            options.value = JSON.parse(JSON.stringify(localOptions))
        }

        // Установка выбранной опции
        const setActiveOptions = async (value) => {
            search.value = ''

            // Нахождение выбранной опции
            const findOption = (value) => {
                let findedOption = options.value == null ? null : options.value.find(option => option.value == String(value))
                if ([null, undefined].includes(findedOption)) {
                    return nullOption 
                } else {
                    return findedOption
                }
            }

            if (props.isMultiple) {
                let data = []

                for (let item of multiplyValues.value) {
                    data.push(findOption(item))
                }

                activeOptions.value = data.filter(option => option.value != null)
            } else {
                activeOptions.value = findOption(value)
            }
        }

        // Поиск опций
        const searchOptions = (value) => {
            search.value = value
            options.value = backupOptions.value.filter(option => option.label.toLowerCase().includes(search.value.toLowerCase()))

            if (!popupRef.value.popupRef.hasAttribute('open')) {
                popupRef.value.popupRef.setAttribute('open', true)
            }
        }

        // Изменить значение поля
        const changeValue = (value, event = null) => {
            if (value == null || (![null, undefined].includes(props.item.lockedOptions) ? !props.item.lockedOptions.includes(value) : true)) {
                search.value = null

                if (props.isFiltered) {
                    options.value = backupOptions.value
                }
                
                if (props.isMultiple) {
                    if (multiplyValues.value.includes(value)) {
                        multiplyValues.value = multiplyValues.value.filter(option => option != value)
                        showContent(true)
                    } else {
                        multiplyValues.value.push(value)
                    }

                    setTimeout(() => {
                        mirrorRef.value.focus()
                    }, 10);

                    emit('changeValue', {
                        key: props.item.key,
                        value: multiplyValues.value
                    })
                } else {
                    showContent(false)

                    emit('changeValue', {
                        key: props.item.key,
                        value: value
                    })
                }

                setActiveOptions(value)

            }
        }

        switch (data.action) {
            // Отображение всплывающего окна
            case 'showContent':
                showContent(data.value)
                break;

            // Установка выбранной опции
            case 'setActiveOptions':
                await setActiveOptions(data.value)
                break;

            // Поиск опций
            case 'searchOptions':
                searchOptions(data.value)
                break;

            // Изменить значение поля
            case 'changeValue':
                changeValue(data.value, data.event)
                break;

            // Получение опций
            case 'getOptions': 
                await getOptions()
                break;

            default:
                break;
        }
    }

    onMounted(async () => {

        await callAction({
            action: 'getOptions',
            value: null
        })
        backupOptions.value = JSON.parse(JSON.stringify(options.value))

        if (props.isMultiple) {
            if ([null, undefined].includes(props.item.value) || typeof props.item.value == 'string') {
                multiplyValues.value = []
            } else {
                multiplyValues.value = [...new Set(props.item.value)]
            }
        }

        await callAction({
            action: 'setActiveOptions',
            value: props.item.value
        })
    })

    watch(() => props.item.options, () => {
        callAction({
            action: 'getOptions',
            value: null
        })    
    }, {
        deep: true
    })

    watch(() => props.item.value, () => {
        if (props.isMultiple) {
            if ([null, undefined].includes(props.item.value) || typeof props.item.value == 'string') {
                multiplyValues.value = []
            } else {
                multiplyValues.value = [...new Set(props.item.value)]
            }
        }

        callAction({
            action: 'getOptions',
            value: null
        })

        callAction({
            action: 'setActiveOptions',
            value: props.item.value
        })
    })

    watch(() => props.item.focus, () => {
        setTimeout(() => {
            if (props.item.focus) {
                popupRef.value.popupRef.setAttribute('open', true)
                PopupScripts.setDropdownPosition(popupRef.value.popupRef)
            }
        }, 10);
    })

</script>
