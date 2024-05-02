<template>
    <div class="status__option status-option">
        <div class="status-option__rect" :style="`--backgroundColor: ${props.option == null ? '#ccc' : props.option.color}`">
            <img 
                v-if="props.option != null && ![null, undefined].includes(props.option.file) && props.option.file != ''"
                class="status-option__image" 
                :src="props.option.file"
                :alt="props.option.text"
            />
        </div>
        <div class="status-option__text">
            {{ props.option == null ? null : props.option.text }}
        </div>
    </div>
</template>

<script setup>
    import './StatusOption.scss';
    
    const props = defineProps({
        option: {
            default: {
                file: null,
                color: "#1f4fc6ff",
                text: "не выбрано",
            },
            type: Object
        }
    })
</script>
