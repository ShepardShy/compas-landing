<template>
    <AppPopup ref="popupRef" :closeByClick="true" :isCanSelect="false" class="table-categories__popup" @openPopup="() => openPopup()">
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
                Создать подгруппу
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
                Редактировать
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

    const popupRef = ref(null)

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

    const openPopup = () => {
        if (popupRef.value.popupRef.closest('summary details')) {
            let parentDelails = popupRef.value.popupRef.closest('.table-categories__details')
            if (parentDelails.hasAttribute('open')) {
                setTimeout(() => {
                    if (popupRef.value.popupRef.hasAttribute('open')) {
                        popupRef.value.popupRef.removeAttribute('open')
                    } else {
                        popupRef.value.popupRef.setAttribute('open', true)
                    }
                }, 10);
            }
        }
    }
</script>
