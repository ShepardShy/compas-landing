<template>
    <div class="tile-section__header">
        <div 
            class="tile-section__title" 
        >
            <IconDragSection v-if="isEditableSettings"/>

            <AppH3Editable 
                v-if="isEditableSettings"
                :item="{
                    value: section.name,
                    key: 'tileHeader',
                }"
                @saveTitle="(data) => emit('callAction', { 
                    action: 'changeTitle', 
                    value: {
                        id: section.id,
                        name: data
                    } 
                })"
            />
            <AppH3 v-else>
                {{ section.name }}
            </AppH3>
        </div>
        <div class="tile-section__header-actions">
            <ButtonText @click="() => emit('callAction', { action: 'changeState', value: null })">
                {{ section.state ? 'Отмена' : 'Изменить' }}

            </ButtonText>

            <AppPopup :isCanSelect="false" :closeByClick="true" v-if="isEditableSettings">
                <template #summary>
                    <IconSettings />
                </template>
                <template #content>
                    <PopupOption class="popup__option_red" @click="() => emit('callAction', { action: 'delete', value: section.id })">
                        Удалить
                    </PopupOption>
                </template>
            </AppPopup>
        </div>
    </div>
</template>

<script setup>
    import './Header.scss';
    
    import { inject } from 'vue';

    import AppPopup from '@/components/AppPopup/Popup.vue';
    import IconDragSection from '@/components/AppIcons/DragSection/DragSection.vue';
    import AppH3Editable from '@/components/AppHeaders/H3/Editable/Editable.vue';
    import AppH3 from '@/components/AppHeaders/H3/H3.vue';
    import IconSettings from '@/components/AppIcons/Settings/Settings.vue';
    import ButtonText from '@/components/AppButton/ButtonText/ButtonText.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    const emit = defineEmits([
        'callAction'
    ])

    const section = inject('section')
    const isEditableSettings = inject('isEditableSettings')
</script>
