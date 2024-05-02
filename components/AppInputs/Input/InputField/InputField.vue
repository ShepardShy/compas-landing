<template>
	<input
        v-if="props.mask != '' && ![undefined, null].includes(props.mask) || props.item.type == 'number'"
		ref="inputRef"
        v-maska
        data-maska-tokens="A:[a-zA-Zа-яА-Я]|#:[0-9]|R:[а-яА-Я]"
        :data-maska="props.item.type == 'number' ? '#######################' : props.mask"
		:type="'text'"
		:value="props.item.value"
		:disabled="props.disabled"
		:placeholder="props.item.placeholder"
		:autocomplete="props.enabledAutocomplete"
		@maska="(e) => $emit('changeValue', {key: props.item.key, value: e.target.value})"
    />

    <input
        v-else
		ref="inputRef"
		:type="props.item.type"
		:value="value"
		:disabled="props.disabled"
		:placeholder="props.item.placeholder"
		:autocomplete="props.enabledAutocomplete"
		@input="(e) => $emit('changeValue', {key: props.item.key, value: e.target.value})"
    />
</template>

<script setup>
	import './InputField.scss';

    import { ref, watch, onMounted } from 'vue'

    const inputRef = ref()
    const value = ref(null)

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
        enabledAutocomplete: {
            default: true,
            type: Boolean
        },
        disabled: {
            default: false,
            type: Boolean
        },
        mask: {
            default: null,
            type: String
        }
    })

    watch(() => props.item.focus, () => {
        if (props.item.focus) {
            setTimeout(() => {
                inputRef.value.focus()
            }, 10);
        }
    })

    watch(() => props.item.value, () => {
        value.value = props.item.value
    })

    onMounted(() => {
        if (props.item.focus) {
            setTimeout(() => {
                inputRef.value.focus()
            }, 10)
        }

        value.value = props.item.type == 'password' ? null : props.item.value
    })

    defineExpose({
        inputRef
    })
</script>
