<template>
    <input
        autocomplete="off"
        type="checkbox"
        :value="props.item.value"
        :checked="props.item.value"
        :disabled="props.disabled"
        :id="`checkbox_${props.item.id}`"
        @change="() => props.changeValueLabel ? null : $emit('changeValue', {id: props.item.id, value: !props.item.value})"
    />

    <label :for="`checkbox_${props.item.id}`">
        <IconCheckbox />
    </label>
</template>

<script setup>
    import './CheckboxField.scss';

    import IconCheckbox from './IconCheckbox.vue'
    
    const props = defineProps({
        item: {
            default: {
                id: 0,
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
        }
    })
</script>
