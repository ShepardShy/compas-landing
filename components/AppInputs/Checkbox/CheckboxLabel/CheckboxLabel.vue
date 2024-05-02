<template>
    <div class="form-item__title" v-if="props.isHTML" v-html="props.title"></div>

    <div v-else class="form-item__title" >
        {{ props.title }}
    </div>
</template>

<script setup>
    import './CheckboxLabel.scss';
    
    const props = defineProps({
        title: {
            default: null,
        },
        isHTML: {
            default: false,
            type: Boolean
        }
    })
</script>
