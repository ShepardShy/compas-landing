<template>
    <AppSection class="composite-block section_without-background">
        <div class="section__content">
            <div class="section__info">
                <slot name="content"></slot>
            </div>
        </div>
        <div class="section__image">
            <slot name="image"></slot>
        </div>
    </AppSection>
</template>

<script setup>
    import './CompositeBlock.scss';
    
    import AppSection from '../AppSection.vue';
</script>
