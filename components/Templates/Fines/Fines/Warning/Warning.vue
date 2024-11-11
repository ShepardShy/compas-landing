<template>
    <WarningValidation 
        v-if="isShow.state && isShow.type == 'validation'"
    />
</template>

<script setup>
    import './Warning.scss';
    
    import { inject } from 'vue'

    import WarningValidation from './Validation/Validation.vue'
    
    const isShow = inject('isShow')
</script>
