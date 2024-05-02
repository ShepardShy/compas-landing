<template>
    <div class="button-text" ref="buttonTextRef">
        <slot></slot>
    </div>
</template>

<script setup>
    import './ButtonText.scss';

    const buttonTextRef = ref(null)

    defineExpose({
        buttonTextRef
    })
</script>
