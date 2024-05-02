<template>
    <AppPopup :closeByClick="true" :isCanSelect="false" class="table-categories__popup">
        <template #summary>
            <IconDots />
        </template>
        <template #content>
            <PopupOption 
                @click="(event) => {
                    event.preventDefault(); 
                    emit('callAction', {
                        action: 'initCreateSubCategory', 
                        value: {
                            parent_id: props.parent_id,
                            id: props.item.id
                        }
                    })
                }">
                Создать группу
            </PopupOption>
            <PopupOption 
                @click="(event) => {
                    event.preventDefault(); 
                    emit('callAction', {
                        action: 'initUpdateCategory', 
                        value: {
                            parent_id: props.parent_id,
                            id: props.item.id
                        }
                    })
                }">
                Изменить категорию
            </PopupOption>
            <PopupOption 
                class="popup__option_red" 
                @click="(event) => {
                    event.preventDefault(); 
                    emit('callAction', {
                        action: 'initDeleteCategory', 
                        value: {
                            parent_id: props.parent_id,
                            id: props.item.id,
                            name: props.item.name
                        }
                    })
                }">
                Удалить
            </PopupOption>
        </template>
    </AppPopup>
</template>

<script setup>
    import './Details.scss';
    
    import IconDots from '@/components/AppIcons/Dots/Dots.vue'
    import AppPopup from '@/components/AppPopup/Popup.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        item: {
            default: {
                title: '',
                children: []
            },
            type: Object
        },
        parent_id: {
            default: null,
            type: Number
        }
    })
</script>
