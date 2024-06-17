<template>
    <div class="filter__menu">
        <Fields 
            @actionFilter="(data) => emit('actionFilter', data)"
        />
        <Saves 
            @actionSaves="(data) => emit('actionSaves', data)"
        />
        <Actions 
            @actionSaves="(data) => emit('actionSaves', data)"
            @actionFilter="(data) => emit('actionFilter', data)"
        />
    </div>
</template>

<script setup>
    import './FilterMenu.scss';
    
    import Saves from './Saves/Saves.vue';
    import Fields from './Fields/Fields.vue';
    import Actions from './Actions/Actions.vue';

    const emit = defineEmits([
        'actionSaves',
        'actionFilter'
    ])

</script>
