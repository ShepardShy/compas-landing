<template>
    <section ref="sectionRef">
        <slot></slot>
    </section>
</template>

<script setup>
    import './AppSection.scss';

    const sectionRef = ref()
    
    defineExpose({
        sectionRef
    })
</script>
