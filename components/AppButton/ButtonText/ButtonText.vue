<template>
    <div class="button-text" ref="buttonTextRef">
        <slot></slot>
    </div>
</template>

<script setup>
    import './ButtonText.scss';

    import { ref } from 'vue'

    const buttonTextRef = ref(null)

    defineExpose({
        buttonTextRef
    })
</script>
