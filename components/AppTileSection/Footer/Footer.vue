<template>
    <div class="tile-section__footer" v-if="isEditableSettings">
        <AppPopup :closeByClick="true" :isCanSelect="false">
            <template #summary>
                <ButtonText>
                    Добавить
                </ButtonText>
            </template>
            <template #content>
                <PopupOption 
                    v-for="field in hiddenFields" 
                    @click="() => emit('callAction', {
                        action: 'changeVisibleField', 
                        value: {
                            state: 'visible',
                            field: field
                        }
                    })"
                >
                    {{ field.title }}
                </PopupOption>
                <PopupOption class="popup__option_empty" v-show="hiddenFields.length == 0">
                    Пусто
                </PopupOption>
            </template>
        </AppPopup>

        <ButtonText @click="() => emit('callAction', { action: 'initCreateField', value: null })">
            Создать поле
        </ButtonText>
    </div>
</template>

<script setup>
    import './Footer.scss';

    import { inject } from 'vue';

    import AppPopup from '@/components/AppPopup/Popup.vue';
    import ButtonText from '@/components/AppButton/ButtonText/ButtonText.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    const emit = defineEmits([
        'callAction'
    ])

    const hiddenFields = inject('hiddenFields')
    const isEditableSettings = inject('isEditableSettings')
</script>
