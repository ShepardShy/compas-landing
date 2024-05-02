<template>
    <FormItem 
        class="form-item__textarea" 
        :class="[null, undefined].includes(props.item.value) || props.item.value == '' ? 'form-item__textarea_empty' : ''"
        :required="props.item.required"
    >
        <FormLabel
            :title="props.item.title"
            v-show="props.item.title != null && props.item.title != ''"
        />

        <FormValue 
            v-if="props.isReadOnly"
            :value="props.item.value"
            :isHTML="true"
        />

        <TextareaField
            v-else
            :item="props.item"
            :mask="props.item.type == 'number' ? '#######################' : props.mask"
            :disabled="props.disabled"
            :isUseEnter="props.isUseEnter"
            :isTableItem="props.isTableItem"
            @focus="(data) => $emit('focus', data)"
            @blur="(data) => $emit('blur', data)"
            @changeValue="(data) => $emit('changeValue', data)"
        />

	    <span v-if="![null, undefined].includes(props.item.substring) && props.item.substring != ''" class="form-item__substring"> 
            {{ props.item.substring }}
        </span>

        <a
		    v-if="props.item.key == 'phone' && (saveValueForCall != null && saveValueForCall != '')"
		    :href="`tel:${saveValueForCall}`"
		    class="button-text button-text__action"
	    >
		    Позвонить
	    </a>
    </FormItem>
</template>

<script setup>
    import './Textarea.scss';

    import TextareaField from './TextareaField/TextareaField.vue';
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';
    import FormValue from '@/components/AppForm/FormValue/FormValue.vue';

    const props = defineProps({
        item: {
            default: {
                id: 0,
                key: '',
                title: '',
                value: '',
                type: 'text',
                focus: false,
                substring: '',
                placeholder: ''
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
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isTableItem: {
            default: false,
            type: Boolean
        }
    })
</script>
