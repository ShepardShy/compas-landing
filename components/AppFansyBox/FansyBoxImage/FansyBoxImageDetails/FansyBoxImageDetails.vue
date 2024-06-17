<template>
    <AppPopup class="fancybox-item__details popup_actions" :isCanSelect="false" :closeByClick="true">
        <template #summary>
            <IconDots />
        </template>
        <template #content>
            <PopupOption :data-fancybox="`galleryClickView_${props.id}`" :href="checkExtension ? props.image.file : props.image.url">
                Посмотреть
            </PopupOption>
            <PopupOption @click="() => emit('callAction', { action: 'downloadFile', value: props.image })">
                Скачать
            </PopupOption>
            <PopupOption class="popup__option_red" @click="() => emit('callAction', { action: 'deleteFile', value: props.image.id })">
                Удалить
            </PopupOption>
        </template>
    </AppPopup>
</template>

<script setup>
    import './FansyBoxImageDetails.scss';

    import {computed} from "vue";
    
    import IconDots from '@/components/AppIcons/Dots/Dots.vue'
    import PopupOption from "@/components/AppPopup/PopupOption/PopupOption.vue";
    import AppPopup from "@/components/AppPopup/Popup.vue";

    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        image: {
            default: {
                id: 1649,
                url: "/",
                file: "/",
                extension: "png"
            },
            type: Object
        },
        id: {
            default: 0,
            type: Number
        }
    })

    const checkExtension = computed(() => {
        return ['png', 'svg', 'heic', 'jpeg', 'jpg', 'webp', 'pdf', 'gif', 'mp4', 'mp3'].includes(props.image.extension)
    })
</script>
