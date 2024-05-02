<template>
    <FormItem :required="props.item.required" :isReadOnly="props.isReadOnly">
        <FormLabel 
            v-show="props.item.title != null && props.item.title != ''"
            :title="props.item.title"
        />
        <FormValue 
            :isHTML="props.isHTML"
            :isLink="props.isLink"
            :value="props.item.value"
            @click="() => props.isLink ? $emit('openLink', props.item) : ''"
        />
    </FormItem>
</template>

<script setup>
    import './FormField.scss';
    
    import FormItem from '../FormItem/FormItem.vue';
    import FormLabel from '../FormLabel/FormLabel.vue';
    import FormValue from '../FormValue/FormValue.vue';

    const props = defineProps({
        item: {
            default: {
                required: false,
                title: null,
                value: null
            },
            type: Object
        },
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isHTML: {
            default: false,
            type: Boolean
        }
        ,
        isLink: {
            default: false,
            type: Boolean
        }
    })

</script>
