<template>
    <FormItem 
        class="form-item__group-input group-input" 
        :required="props.item.required"
        :style="`--substring: ${props.item.substring != undefined ? props.item.substring : ''}`"
    >
        <FormLabel
            v-show="props.item.title != null && props.item.title != ''"
            :title="props.item.title"
        />

            <div class="group-input__fields" v-if="props.isReadOnly">
                <div class="group-input__field" v-for="field of props.item.subfields">
                    <FormLabel
                        v-show="field.title != null && field.title != ''"
                        :title="field.title"
                    />
                    <FormValue 
                        :value="field.value"
                    />
                </div>
            </div>

            <div class="group-input__fields" ref="fieldsRef" v-else>
                    <AppInput
                        class="group-input__field"
                        v-for="field of props.item.subfields"
                        :item="{
                            id: field.id,
                            required: false,
                            substring: null,
                            type: 'text',
                            title: field.title,
                            placeholder: null,
                            value: field.value,
                            key: field.id,
                            focus: false
                        }"
                        :disabled="props.disabled"
                        @changeValue="(data) => changeValue(data)"
                    />
            </div>
    </FormItem>
</template>

<script setup>
    import './InputGroup.scss';

    import { ref, watch } from 'vue'

    import AppInput from '@/components/AppInputs/Input/Input.vue';
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';
    import FormValue from '@/components/AppForm/FormValue/FormValue.vue';

    const fieldsRef = ref(null)

    const props = defineProps({
        item: {
            default: {
                id: 0,
                key: '',
                value: '',
                type: 'text',
                focus: false,
                placeholder: '',
                substring: null,
                title: 'Undefined title',
                subfields: [
                    {
                        id: 0,
                        title: 'Undefined title',
                        value: null
                    }
                ]
            },
            type: Object
        },
        disabled: {
            default: false,
            type: Boolean
        },
        isReadOnly: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'changeValue'
    ])

    let subfields = ref(props.item.subfields)

    // Изменение значения
    const changeValue = (data) => {
        let findedField = subfields.value.find(item => item.id == data.key)
        findedField.value = data.value
        emit('changeValue', subfields.value)
    }

    watch(() => props.item.focus, () => {
        setTimeout(() => {
            fieldsRef.value.querySelector('input').focus()
        }, 10);
    })
</script>
