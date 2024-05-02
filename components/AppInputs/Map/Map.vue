<template>
    <FormItem
        class="address form-item__address"
        :required="props.item.required"
    >

        <FormLabel 
            v-show="props.isShowLabel && props.item.title != null && props.item.title != ''"
            :title="props.item.title"
        />
        
        <MapField 
            :item="props.item"
            :isShowMap="props.isShowMap"
            :isReadOnly="props.isReadOnly"
            :isCanSelect="props.isCanSelect"
            @changeValue="(data) => emit('changeValue', data)"
        />

    </FormItem>
</template>

<script setup>
    import './Map.scss';

    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';
    import FormItem from "@/components/AppForm/FormItem/FormItem.vue";
    import MapField from './Field/Field.vue'

    const props = defineProps({
        item: {
            default: {
                id: 0,
                title: "Адрес",
                key: "address",
                required: false,
                value: {
                    text: null,
                    coords: []
                }
            },
            type: Object
        },
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isShowMap: {
            default: false,
            type: Boolean
        },
        isCanSelect: {
            default: false,
            type: Boolean
        },
        isShowLabel: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'changeValue'
    ])
</script>