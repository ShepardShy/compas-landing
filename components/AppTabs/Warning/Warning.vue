<template>
    <WarningSettings
        v-if="isShow.state && isShow.type == 'updateTabs'"
    />
</template>

<script setup>
    import './Warning.scss';
    
    import { inject } from 'vue'

    import WarningSettings from './Settings/Settings.vue'
    
    const isShow = inject('isShow')

</script>
