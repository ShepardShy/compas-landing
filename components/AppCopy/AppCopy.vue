<template>
    <ButtonText
        class="copy button-text__copy"
        :class="copyState ? 'button-text__copy_disabled' : ''"
        @click="() => copyAddress()"
    >
        <template v-if="!copyState">
            {{ props.buttonTitle }}
        </template>
        <template v-else>
            Скопировано
        </template>
        <div class="button-text__mirror" ref="buttonTextRef">
            {{ props.text }}
        </div>
    </ButtonText>
</template>

<script setup>
    import './AppCopy.scss';

    import ButtonText from "@/components/AppButton/ButtonText/ButtonText.vue";

    import {ref} from "vue";

    const props = defineProps({
        text: {
            default: '',
            type: String
        },
        type: {
            default: '',
            type: String
        },
        buttonTitle: {
            default: null,
            type: String
        }
    })

    const copyState = ref(false)
    const buttonTextRef = ref(null)

    const copyAddress = () => {
        if (copyState.value) return

        const range = document.createRange();
        range.selectNode(buttonTextRef.value);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        copyState.value = true

        setTimeout(() => {
            copyState.value = false
        }, 2000)
    }
</script>
