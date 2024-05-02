<template>
    <button :disabled="props.disabledOption">
        <span>
            <slot> </slot>
        </span>
    </button>
</template>

<script setup>
    import './AppButton.scss';
    
    const props = defineProps({
        disabledOption: {
            default: false,
            type: Boolean
        }
    })
</script>
