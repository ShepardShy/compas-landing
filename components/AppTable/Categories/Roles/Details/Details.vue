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
                        action: 'initUpdateRole', 
                        value: {
                            id: props.item.id
                        }
                    })
                }">
                Изменить имя
            </PopupOption>

            <PopupOption>
                <AppCheckbox 
                    :item="{
                        id: props.item.id,
                        value: props.item.is_admin,
                        title: 'Права администратора',
                        key: 'is_admin'
                    }"
                    @changeValue="(data) => emit('callAction', {
                        action: 'changeRole', 
                        value: {
                            id: props.item.id,
                            value: data.value
                        }
                    })"
                />
            </PopupOption>

            <PopupOption 
                class="popup__option_red" 
                @click="(event) => {
                    event.preventDefault(); 
                    emit('callAction', {
                        action: 'initDeleteRole', 
                        value: {
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
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue';
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
        }
    })
</script>
