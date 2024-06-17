<template>
    <FansyBox
        class="file__container file-container form-item__value"
        :class="setClasses"
    >
        <draggable
            tag="div"
            v-model="localImages"
            class="file__list file-list"
            :class="props.isShowFileName ? 'file-list_show-title' : ''"
            :forceFallback="true"
            :itemKey="'fileFields'"
            :key="props.item.key"
            :disabled="props.isOneFile"
            handle=".fancybox-item__link"
            :draggable="props.isDraggable ? '.file-list__item:not(.file-list__item_undraggable)' : '.file-list__item-none'"
            @end="(event) => callAction(event)"
        >
            <template #item="{ element: image }" >
                <FansyBoxImage
                    v-if="!props.isIcon"
                    class="file-list__item"
                    :id="props.item.id"
                    :isShowFileName="props.isShowFileName"
                    :isOneFile="props.isOneFile"
                    :image="image"
                    :loading="image.status == 'loading'"
                    :class="image.status == 'loading' ? 'file-list__item_loading' : ''"
                    @callAction="(data) => callAction(data)"
                />
            </template>
            <template #footer>
                <Upload
                    v-show="!props.isReadOnly"
                    :buttonTitle="props.item.buttonName"
                    :isMultiple="props.isMultiple"
                    :isIcon="props.isIcon"
                    :buttonIcon="props.isIcon ? localImages[0] : null"
                    @callAction="(data) => callAction(data)"
                />
            </template>
        </draggable>

        <div class="file-container__circle" v-if="props.isOneFile && props.isReadOnly && localImages.length > 1">
            {{ localImages.length }}
        </div>
    </FansyBox>
</template>

<script setup>
    import './Field.scss';

    import draggable from 'vuedraggable'

    import commonScripts from "@/commonScripts/commonScripts";

    import FansyBox from '@/components/AppFansyBox/FansyBox.vue';
    import FansyBoxImage from '@/components/AppFansyBox/FansyBoxImage/FansyBoxImage.vue';
    import Upload from "../Upload/Upload.vue";
    import {computed, onMounted, ref, watch} from "vue";

    const props = defineProps({
        item: {
            default: {
                id: 1517,
                title: "Undefined title",
                type: "file",
                key: "",
                required: false,
                options: null,
                focus: true,
                value: null,
                buttonName: "",
            },
            type: Object
        },
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isShowFileName: {
            default: false,
            type: Boolean
        },
        isMultiple: {
            default: false,
            type: Boolean
        },
        isOneFile: {
            default: false,
            type: Boolean
        },
        isIcon: {
            default: false,
            type: Boolean
        },
        isDraggable: {
            default: true,
            type: Boolean
        },
        pageId: {
            default: null,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'changeValue',
        'initEdit'
    ])

    // Получение значении
    const getValues = () => {
        if ([null, undefined].includes(props.item.value) || !Array.isArray(props.item.value)) {
            return []
        } else {
            const localValues = props.item.value == null ? [] : props.item.value.filter(p => ![null, undefined].includes(p) && !Array.isArray(p) && Object.keys(p).length !== 0 && typeof p != 'string')
            return JSON.parse(JSON.stringify(localValues))
        }
    }

    const localImages = ref([])

    const setClasses = computed(() => {
        return [
            localImages.value.length == 0 && props.isReadOnly ? 'form-item__value_empty' : '',
            props.isOneFile ? 'file-container_one-file' : ''
        ]
    })

    // Вызов деиствий и изменение значений
    const callAction = (data) => {
        const supportedExtensions = ['png', 'heic', 'svg', 'jpeg', 'jpg', 'webp', 'pdf', 'gif', 'mp4', 'xlsx', 'xls', 'mp3', 'doc', 'docx', 'txt', 'pptx'];

        // Скачивание файла
        const downloadFile = async () => {
            const imageSrc = data.value.file;
            const nameOfDownload = [null, undefined].includes(data.value.name) || data.value.name !== '' ? data.value.name : 'my-image.png'

            try {
                const response = await fetch(imageSrc, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                    },
                });

                const blobImage = await response.blob();

                const href = URL.createObjectURL(blobImage);

                const anchorElement = document.createElement('a');
                anchorElement.href = href;
                anchorElement.download = nameOfDownload;

                document.body.appendChild(anchorElement);
                anchorElement.click();

                document.body.removeChild(anchorElement);
                window.URL.revokeObjectURL(href);
            } catch (error) {
                console.log(error);
            }
        }

        // Локальное удаление эллемента
        const deleteFile = (id) => {
            localImages.value = localImages.value.filter(item => item.id !== id);
            emit('changeValue', { key: props.item.key, value: localImages.value })
        }

        // Добавление файлов
        const addFiles = () => {
            // Загрузка файлов
            const uploadFile = async (data, id) => {
                // Добавление загружаемого изображения
                const preAddImage = (id) => {
                    const downloadingItem = {
                        id: id,
                        name: "Загрузка",
                        url: null,
                        file: null,
                        extension: '',
                        status: 'loading'
                    }

                    localImages.value.splice(localImages.value.length, 0, downloadingItem);
                }

                // Добавление успешно загруженного изображения
                const addImage = (image, id) => {
                    const currentImage = localImages.value.find(item => item.id == id);

                    currentImage.id = image.id;
                    currentImage.name = image.name;
                    currentImage.url = image.url;
                    currentImage.file = image.file;
                    currentImage.extension = image.extension;
                    currentImage.status = 'success';

                    emit('changeValue', { key: props.item.key, value: localImages.value })
                }

                const sendImage = () => {
                    preAddImage(id)

                    const ajax = new XMLHttpRequest();
                    const localItem = localImages.value.find(item => item.id == id)

                    // Отслеживание прогресса загрузки файла
                    ajax.upload.onprogress = function(event) {
                        localItem.progress = (event.loaded / event.total) * 100;
                    };

                    // Событие окончания загрузки файла
                    ajax.onloadend = function() {
                        try {
                            const responseObj = JSON.parse(ajax.response)[0];
                            addImage(responseObj, id);
                        } catch (error) {
                            deleteFile(id)
                            console.log('error', error);
                        }
                    };

                    ajax.open('POST', `https://opt6.compas.pro/api/files/store?field_id=${props.item.id}&page_id=${props.pageId}`, true);
                    // ${userStore.userToken}
                    ajax.setRequestHeader("Authorization", `Bearer `);
                    ajax.send(data);
                }

                sendImage()
            }

            data.value.forEach(async (file) => {
                if (!supportedExtensions.includes(file.name.split('.').splice(-1)[0].toLowerCase())) {
                    commonScripts.showNotification({
                        title: 'Ошибка загрузки файла',
                        description: `Поддерживаемыей файлы ${supportedExtensions.join(', ')}`
                    }, 'error')
                    return
                }

                const formData = new FormData()
                const id = new Date().getTime()
                formData.append('files[]', file)

                await uploadFile(formData, id)
            })
        }

        // Удаление иконки
        const deleteIcon = (file) => {
            localImages.value = localImages.value.filter(item => item.file != file);
            emit('changeValue', { key: props.item.key, value: localImages.value })
        }

        switch (data.action) {
            // Добавление файлов
            case 'addFiles':
                addFiles();
                break;

            // Скачивание файла
            case 'downloadFile':
                downloadFile();
                break;

            // Локальное удаление эллемента
            case 'deleteFile':
                deleteFile(data.value);
                break;

            // Удаление иконки
            case 'deleteIcon':
                deleteIcon(data.value)
                break;

            default:
                emit('initEdit', data)
                emit('changeValue', { key: props.item.key, value: localImages.value })
                break;
        }
    }

    watch(() => props.isReadOnly, () => {
        localImages.value = getValues();
    })

    watch(() => props.item.value, () => {
        localImages.value = getValues();
    }, {
        deep: true
    })

    onMounted(() => {
        localImages.value = getValues();
    })
</script>
