<template>
	<input
        v-if="props.mask != '' && ![undefined, null].includes(props.mask) || props.item.type == 'number'"
		ref="inputRef"
        v-maska
        data-maska-tokens="A:[a-zA-Zа-яА-Я]|#:[0-9]"
        :data-maska="props.item.type == 'number' ? '#######################' : props.mask"
		:type="'text'"
        autocorrect="off"
		:value="props.item.value"
		:disabled="props.disabled"
		:placeholder="props.item.placeholder"
		:autocomplete="props.enabledAutocomplete ? 'on' : 'off'"
		@maska="(e) => $emit('changeValue', {key: props.item.key, value: e.target.value})"
    />

    <div class="input__group" v-else-if="props.item.type == 'password'">
        <input
            ref="inputRef"
            autocorrect="off"
            :type="passwordType"
            :value="props.item.value"
            :disabled="props.disabled"
            :placeholder="props.item.placeholder"
            :autocomplete="props.enabledAutocomplete ? 'on' : 'off'"
            @input="(e) => $emit('changeValue', {key: props.item.key, value: e.target.value})"
        />
        <IconPasswordEye  :class="passwordType == 'text' ? 'icon__password-eye_active' : ''" @click="changePasswordType"/>
    </div>

    <input
        v-else
        autocorrect="off"
        ref="inputRef"
		:type="props.item.type"
		:value="props.item.value"
		:disabled="props.disabled"
		:placeholder="props.item.placeholder"
		:autocomplete="props.enabledAutocomplete ? 'on' : 'off'"
		@input="(e) => $emit('changeValue', {key: props.item.key, value: e.target.value})"
    />
</template>

<script setup>
	import './InputField.scss';

    import { ref, watch, onMounted } from 'vue'
    import IconPasswordEye from '@/components/AppIcons/PasswordEye/PasswordEye.vue'

    const inputRef = ref()

    let passwordType = ref('password')

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

    const changePasswordType = () => {
        if (passwordType.value == 'password') {
            passwordType.value = 'text'
        } else {
            passwordType.value = 'password'
        }
    }

    watch(() => props.item.focus, () => {
        if (props.item.focus) {
            setTimeout(() => {
                inputRef.value.focus()
            }, 10);
        }
    })

    onMounted(() => {
        if (props.item.focus) {
            setTimeout(() => {
                inputRef.value.focus()
            }, 10)
        }
    })

    defineExpose({
        inputRef
    })
</script>
