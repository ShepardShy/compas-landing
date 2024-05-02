<template>
    <div class="button-details">
        <AppButton class="button_blue button_add" :class="props.loaderButton ? 'button_loading' : ''" @click="() => emit('mainAction', true)">
            <slot></slot>
        </AppButton>

        <AppPopup class="button-details__popup" :isCanSelect="false" :closeByClick="true">
            <template #summary> 
                <IconTriangle />
            </template>
            <template #content>
                <PopupOption v-for="option in props.options" @click="() => emit('callAction', option)">
                    {{ option.name }}
                </PopupOption>
            </template>
        </AppPopup>
    </div>
</template>

<script setup>
    import './ButtonDetails.scss';
    
    import AppButton from '../AppButton.vue';
    import IconTriangle from '@/components/AppIcons/Triangle/Triangle.vue';
    import AppPopup from '@/components/AppPopup/Popup.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    const props = defineProps({
        options: {
            default: [],
            type: Array
        },
        loaderButton: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'callAction'
    ])
</script>