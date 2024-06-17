<template>
    <WarningDelete 
        v-if="isShow.state && isShow.type == 'delete'"
    />

    <WarningSettings 
        v-else-if="props.loaderState == 'createField' || (isShow.state && (isShow.type == 'settings' || isShow.type == 'create'))"
        :loaderState="props.loaderState"
        :sections="props.sections"
    />
</template>

<script setup>
    import './Warning.scss';
    
    import { inject } from 'vue'

    import WarningDelete from './Delete/Delete.vue'
    import WarningSettings from './Settings/Settings.vue'

    const isShow = inject('isShow')

    const props = defineProps({
        loaderState: {
            default: null,
            type: String
        },
        sections: {
            default: [],
            type: Array
        }
    })

</script>
