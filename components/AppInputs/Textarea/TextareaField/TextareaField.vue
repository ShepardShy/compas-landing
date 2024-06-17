<template>
    <div class="textarea">
        <textarea
            type="text"
            ref="textareaRef"
            autocomplete="off"
            autocorrect="off"
            :disabled="props.disabled"
            :value="mirrorText"
            :placeholder="props.item.placeholder"
            :id="`input_${props.item.id}`"
            @input="(event) => changeValue(event.target.value)"
            @blur="(event) => emit('blur', event)"
        > </textarea>

        <pre class="textarea__mirror">{{ mirrorText }}</pre>
    </div>
</template>

<script setup>
    import './TextareaField.scss';

    import { ref, onMounted, watch } from 'vue'

    let mirrorText = ref('');
    let textareaRef = ref(null);

    const emit = defineEmits([
        'changeValue',
    ])

    const props = defineProps({
        item: {
            default: {
                id: 0,
                key: '',
                value: '',
                type: "text",
                placeholder: '',
                title: "Undefined title"
            },
            type: Object
        },
        disabled: {
            default: false,
            type: Boolean
        },
        mask: {
            default: null,
            type: String
        },
        isUseEnter: {
            default: true,
            type: Boolean
        },
        isTableItem: {
            default: false,
            type: Boolean
        }
    })

    // Изменение значения
    const changeValue = (value) => {
        // Создание регулярного выражения из маски
        const createRegexpMask = (mask) => {
            let newReg = '^'
            mask = mask.replace(/[\s()\-+]/g, '')

            for (let symb of mask) {
                switch(symb) {
                    case '#': 
                        newReg += `[0-9]{1}`
                        break;
                    case 'A': 
                        newReg += `[а-яa-zА-ЯA-Z]{1}`
                        break;
                    case 'R':
                        newReg += `[а-яА-Я]{1}`
                        break;
                    default: 
                        if (Number(symb) != NaN) {
                            newReg += `[\\d]{1}`
                        }
                        break;
                }

            }
            newReg += '$'

            return new RegExp(newReg)
        }
    
        // Проверка на Enter
        const checkInputEnter = () => {
            return (/\n/i.test(value))
        }

        // Проверка по маске
        const checkInputMask = () => {
            let mask = null
            let regExp = null

            if (value.length > props.mask.length) {
                return false
            } else {
                mask = props.mask.replaceAll(' ', '').substring(0, value.length)
                regExp = createRegexpMask(mask)

                if (!regExp.test(value)) {
                    return false
                } else {
                    return true 
                }
            }
        }

        // Изменение значения
        const setValue = () => {
            if (!props.isUseEnter) {
                if (checkInputEnter()) {
                    textareaRef.value.value = mirrorText.value;
                    return
                }
            }


            if (props.mask != '' && ![undefined, null].includes(props.mask)) {
                if (checkInputMask()) {
                    mirrorText.value = value
                } else {
                    textareaRef.value.value = mirrorText.value;
                    return
                }
            } else {
                mirrorText.value = value
            }

            emit('changeValue', {
                key: props.item.key,
                value: value
            })
        }

        setValue()
        resize()
    }

    onMounted(() => {
        if (!props.isUseEnter) {
            mirrorText.value = props.item.value != null ? String(props.item.value).replaceAll('\n', '') : props.item.value
        } else {
            mirrorText.value = props.item.value
        }
        new ResizeObserver(resize).observe(textareaRef.value)


        setTimeout(() => {
            if (props.item.focus) {
                textareaRef.value.focus()
            }
        }, 10);
    })

    const resize = () => {
        if (textareaRef.value != null) {
            let textareaMirror = textareaRef.value.closest('.textarea').querySelector('.textarea__mirror');
            textareaMirror.style.height = "1px";
            textareaMirror.style.height = ((props.isTableItem ? 2 : 6) + textareaRef.value.scrollHeight) + "px";
        }
    }

    watch(() => props.item.value, () => {
        if (!props.isUseEnter) {
            mirrorText.value = props.item.value != null ? String(props.item.value).replaceAll('\n', '') : props.item.value
        } else {
            mirrorText.value = props.item.value
        }
    })

    watch(() => props.item.focus, () => {
        if (props.item.focus) {
            textareaRef.value.focus()
        }
    })
</script>
