<template>
    <FormItem 
        class="form-item__status status" 
        :required="props.item.required"
        :isReadOnly="props.isReadOnly"
    >
        <FormLabel 
            :title="props.item.title"
        />

        <StatusField
            :item="props.item"
            :focus="props.item.focus"
            :isReadOnly="props.isReadOnly"
            :isCanCreate="props.isCanCreate"
            :isCanSave="props.isCanSave"
            :isHaveNullOption="props.isHaveNullOption"
            @changeValue="(data) => $emit('changeValue', data)"
        />
    </FormItem>
</template>

<script setup>
    import './Status.scss';
    
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';
    import StatusField from './StatusField/StatusField.vue';

    const props = defineProps({
        item: {
            default: {
                id: 0,
                key: '',
                value: '',
                focus: false,
                required: false,
                title: "Undefined title",
                options: [{
                    label: {
                        id: 0,
                        sort: 0,
                        file: null,
                        is_hidden: 0,
                        field_id: null,
                        color: "#000",
                        text: "",
                    },
                    value: 0
                }],
            },
            type: Object
        },
        isCanCreate: {
            default: false,
            type: Boolean
        },
        isCanSave: {
            default: false,
            type: Boolean
        },
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isHaveNullOption: {
            default: false,
            type: Boolean
        }
    })
</script>
