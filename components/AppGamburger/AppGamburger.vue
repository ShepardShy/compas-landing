<template>
    <svg class="gamburger" @click="emit('showMobileMenu', true)" xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 15 12">
        <path d="M1 0h13a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2zm0 5h13a1 1 0 0 1 0 2H1a1 1 0 1 1 0-2zm0 5h13a1 1 0 0 1 0 2H1a1 1 0 1 1 0-2z" fill="#A6B7D4" fill-rule="evenodd"/>
    </svg>
</template>

<script setup>
    import './AppGamburger.scss';

    const emit = defineEmits([
        'showMobileMenu'
    ])
</script>
