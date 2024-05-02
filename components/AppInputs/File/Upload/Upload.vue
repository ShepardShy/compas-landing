<template>
    <div
        class="file-upload"
        :class="dragover ? 'file-upload_dragover' : ''"
    >
        <input
            type="file"
            class="file-upload__input"
            :multiple="props.isMultiple"
            :title="props.buttonTitle"
            @dragover="dragover = true"
            @dragenter="dragover = true"
            @dragleave="dragover = false"
            @change="(event) => addFiles(event)"
        >

        <div
            v-if="
                !props.isIcon || 
                [null, undefined].includes(props.buttonIcon) ||
                [null, undefined].includes(props.buttonIcon.file) ||
                props.buttonIcon.file == ''
            "
            class="file-upload__button"
        >
            <IconLoadFile />

            <span class="file-upload__button-title">
                {{ props.buttonTitle }}
            </span>
        </div>

        <div
            v-else-if="
                props.isIcon && 
                ![null, undefined].includes(props.buttonIcon) && 
                ![null, undefined].includes(props.buttonIcon.file) && 
                props.buttonIcon.file != ''
            "
            class="file-upload__image-wrapper"
        >

            <img
                class="file-upload__image"
                :src="props.buttonIcon.file"
                alt="Иконка"
            />

            <IconClose
                title="Удалить иконку"
                @click.prevent="emit('callAction', {
                    action: 'deleteIcon',
                    value: props.buttonIcon.file
                })"
            />
        </div>
    </div>
</template>

<script setup>
    import './Upload.scss';

    import {ref} from "vue";

    import IconLoadFile from "@/components/AppIcons/LoadFile/LoadFile.vue";
    import Input from "@/components/Appautocomplete/input.vue";
    import IconClose from "@/components/AppIcons/Close/Close.vue";

    const props = defineProps({
        isMultiple: {
            default: false,
            type: Boolean
        },
        buttonTitle: {
            default: 'Загрузить',
            type: String
        },
        otherIcon: {
            default: null,
            type: Object
        },
        isIcon: {
            default: false,
            type: Boolean
        },
        buttonIcon: {
            default: null,
            type: Object
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    const dragover = ref(false)

    // Добавление файлов
    const addFiles = (event) => {
        dragover.value = false
        emit('callAction', { action: 'addFiles', value: event.target.files })
    }
</script>