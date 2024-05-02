<template>
    <span class="form-item__value" @click="() => openLink()" :class="setClasses" v-if="props.isHTML" v-html="props.value"></span>
    <span 
        v-else
        class="form-item__value" 
        :class="setClasses" 
        @click="() => openLink()" 
    >
        {{ props.value }}

        <div class="form-item__substring" v-if="![null, undefined].includes(props.substring) && props.substring != ''">
            {{ props.substring }}
        </div>
    </span>
</template>

<script setup>
    import './FormValue.scss';

    import { computed } from 'vue';
    
    const props = defineProps({
        value: {
            default: null
        },
        isHTML: {
            default: false,
            type: Boolean
        },
        isLink: {
            default: false,
            type: Boolean
        },
        link: {
            default: null,
            type: String
        },
        substring: {
            default: null,
            type: String
        }
    })

    // Установка CSS-классов
    const setClasses = computed(() => {
        return [
            [null, undefined].includes(props.value) || String(props.value) == '' ? 'form-item__value_empty' : '',
            props.isHTML ? 'form-item__value_html' : '',
            ![null, undefined].includes(props.substring) && props.substring != '' ? 'form-item__value_substring' : '',
            props.isLink && ![null, undefined].includes(props.link) && props.link != '' ? 'form-item__value_link' : ''
        ]
    })

    // Открытие ссылки в новой вкладке
    const openLink = () => {
        if (![null, undefined].includes(props.link)) {
            window.open(props.link, '_blank')
        }
    }
</script>
