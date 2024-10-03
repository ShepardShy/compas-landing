<template>
    <FormItem class="form-item__checkbox" :class="props.disabled ? 'form-item__checkbox_disabled' : ''" @click="(event) => props.changeValueLabel ? changeValue(event) : null">
        <CheckboxLabel 
            @click="e => !props.isTextClickable ? e.stopPropagation() : ''"
            :title="props.item.title"
            :isHTML="props.item.isHTML"
        />
        <CheckboxField 
            :item="{
                id: props.item.id,
                value: props.item.value
            }"
            :changeValueLabel="props.changeValueLabel"
            :disabled="props.disabled"
            @changeValue="(data) => changeValue(data)"
        />
    </FormItem>
</template>

<script setup>
    import './Checkbox.scss';
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';

    import CheckboxLabel from './CheckboxLabel/CheckboxLabel.vue';
    import CheckboxField from './CheckboxField/CheckboxField.vue';

    const props = defineProps({
        item: {
            default: {
                id: 0,
                key: '',
                title: '',
                value: false
            },
            type: Object
        },
        disabled: {
            default: false,
            type: Boolean
        },
        changeValueLabel: {
            default: true,
            type: Boolean
        },
        isTextClickable:{
            default: true,
            type: Boolean
        }
        
    })

    const emit = defineEmits([
        'changeValue'
    ])

    const changeValue = (event) => {
        if (!props.disabled) {
            emit('changeValue', {
                id: props.item.id, 
                key: props.item.key, 
                value: !props.item.value
            }, event)
        }
    }
</script>
