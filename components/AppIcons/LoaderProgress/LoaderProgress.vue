<template>
    <figure class="icon__loader-progress">
        <svg width="24" height="24">
            <circle cx="12" cy="12" r="10" :style="`stroke-dasharray: 62.8, 62.8; stroke-dashoffset: ${props.progressImage};`"></circle>
        </svg>
    </figure>
</template>

<script setup>
    import './LoaderProgress.scss';

    const props = defineProps({
        progressImage: {
            default: 0,
            type: Number
        }
    })

</script>