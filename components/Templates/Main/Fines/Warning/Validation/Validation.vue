<template>
    <AppWarning class="warning__validation" @closeModal="() => showWarning(false)" :isShow="isShow.state">
        <template #title>
            Ошибка валидации
        </template>

        <template #body>
            <div class="warning__text">
                Необходимо заполнить обязательные поля
            </div>
            <div class="warning__list warning-list">
                <div class="warning-list__field" v-for="item in invalidFields">
                    <AppRelation 
                        v-if="item.field.type == 'relation'"
                        :item="{
                            key: item.field.key,
                            type: item.field.type,
                            id: item.field.id,
                            title: item.field.title,
                            substring: item.field.unit,
                            value: item.field.value,
                            is_link: item.field.is_link,
                            is_plural: item.field.is_plural,
                            hiddenOptions: item.field.choosed,
                            required: Boolean(item.field.required),
                            related_table: item.field.related_table,
                            is_external_link: item.field.is_external_link,
                            options: ['status', 'relation'].includes(item.field.type) ? item.field.options : null,
                            external_link: item.field.value != undefined ? item.field.value.external_link : null,
                        }"
                        :isCanCreate="true"
                        :isUseEnter="false"
                        :enabledAutocomplete="false"
                        :isReadOnly="false"
                        :isMultiple="Boolean(item.field.is_plural)"
                        @changeValue="(data) => changeValue(item.field.id, data)"
                    />
                    <AppTextarea 
                        v-else-if="item.field.type == 'text' && item.field.is_plural"
                        :item="{
                            key: item.field.key,
                            type: item.field.type,
                            id: item.field.id,
                            title: item.field.title,
                            substring: item.field.unit,
                            value: [null, undefined].includes(item.field.value) ? null : typeof item.field.value == 'object' ? item.field.value.value : item.field.value,
                            is_link: item.field.is_link,
                            is_plural: item.field.is_plural,
                            hiddenOptions: item.field.choosed,
                            related_table: item.field.related_table,
                            is_external_link: item.field.is_external_link,
                            required: Boolean(item.field.required),
                            options: ['status', 'relation'].includes(item.field.type) ? item.field.options : null,
                            external_link: item.field.value != undefined ? item.field.value.external_link : null,
                        }"
                        :isCanCreate="true"
                        :isUseEnter="false"
                        :enabledAutocomplete="false"
                        :isReadOnly="false"
                        :isMultiple="Boolean(item.field.is_plural)"
                        @changeValue="(data) => changeValue(item.field.id, data)"
                    />
                    <AppInput
                        v-else-if="['number', 'password'].includes(item.field.type) || (item.field.type == 'text' && !item.field.is_plural)"
                        :item="{
                            key: item.field.key,
                            type: item.field.type,
                            id: item.field.id,
                            title: item.field.title,
                            substring: item.field.unit,
                            value: [null, undefined].includes(item.field.value) ? null : typeof item.field.value == 'object' ? item.field.value.value : item.field.value,
                            is_link: item.field.is_link,
                            is_plural: item.field.is_plural,
                            hiddenOptions: item.field.choosed,
                            related_table: item.field.related_table,
                            is_external_link: item.field.is_external_link,
                            required: Boolean(item.field.required),
                            placeholder: item.field.placeholder,
                            options: ['status', 'relation'].includes(item.field.type) ? item.field.options : null,
                            external_link: item.field.value != undefined ? item.field.value.external_link : null,
                        }"
                        :mask="item.field.mask"
                        :isCanCreate="true"
                        :isUseEnter="false"
                        :enabledAutocomplete="false"
                        :isReadOnly="false"
                        :isMultiple="Boolean(item.field.is_plural)"
                        @changeValue="(data) => changeValue(item.field.id, data)"
                    />
                    <AppStatus 
                        v-else-if="item.field.type == 'status'"
                        :item="{
                                key: item.field.key,
                                type: item.field.type,
                                id: item.field.id,
                                title: item.field.title,
                                substring: item.field.unit,
                                value: item.field.value,
                                is_link: item.field.is_link,
                                is_plural: item.field.is_plural,
                                hiddenOptions: item.field.choosed,
                                related_table: item.field.related_table,
                                is_external_link: false,
                                options: item.field.options,
                                required: Boolean(item.field.required),
                                external_link: null,
                            }"
                            :isCanCreate="false"
                            :isHaveNullOption="false"
                            :isUseEnter="false"
                            :enabledAutocomplete="false"
                            :isReadOnly="false"
                            :isMultiple="Boolean(item.field.is_plural)"
                            @changeValue="(data) => changeValue(item.field.id, data)"
                    />
                    <AppSelect 
                        v-else-if="item.field.type == 'select_dropdown'"
                        :item="{
                            id: item.field.id,
                            key: item.field.key,
                            value: item.field.value,
                            focus: false,
                            required: Boolean(item.field.required),
                            title: item.field.title,
                            options: item.field.options,
                            lockedOptions: []
                        }"
                        :isReadOnly="false"
                        :isHaveNullOption="true"
                        :isMultiple="Boolean(item.field.is_plural)"
                        :isFiltered="true"
                        @changeValue="(data) => changeValue(item.field.id, data)"
                    />
                    <AppDate 
                        v-else-if="item.field.type == 'date'"
                        :item="{
                            id: item.field.id,
                            required: Boolean(item.field.required),
                            title: item.field.title,
                            placeholder: null,
                            value: [null, undefined].includes(item.field.value) ? null : String(item.field.value),
                            key: item.field.key,
                            focus: false
                        }"
                        :isMultiple="Boolean(item.field.is_plural)"
                        :isReadOnly="false"
                        @changeValue="(data) => changeValue(item.field.id, data)"
                    />
                    <AppFile 
                        v-else-if="item.field.type == 'file'"
                        :item="{
                            id: item.field.id,
                            title: item.field.title,
                            key: item.field.key,
                            required: Boolean(item.field.required),
                            buttonName: null,
                            value: [null, undefined].includes(item.field.value) ? null : item.field.value
                        }"
                        :isReadOnly="false"
                        :isShowFileName="false"
                        :isMultiple="true"
                        :isOneFile="false"
                        @changeValue="(data) => changeValue(item.field.id, data)"
                    />

                    <div class="warning-list__field-error">
                        {{ item.error }}
                    </div>
                </div> 
            </div>
            <div class="warning__actions">
                <AppButton class="button_blue" @click="() => emit('callAction', true)">
                    Сохранить
                </AppButton>
                <AppButton @click="() => showWarning(false)">
                    Отмена
                </AppButton>
            </div>
        </template>
    </AppWarning>
</template>

<script setup>
    import './Validation.scss';
    
    import { inject } from 'vue'

    import AppButton from '@/components/AppButton/AppButton.vue';
    import AppWarning from '@/components/AppWarning/AppWarning.vue';

    import AppInput from '@/components/AppInputs/Input/Input.vue'
    import AppDate from '@/components/AppInputs/Date/Date.vue'
    import AppFile from '@/components/AppInputs/File/File.vue'
    import AppStatus from '@/components/AppSelects/Status/Status.vue'
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import AppTextarea from "@/components/AppInputs/Textarea/Textarea.vue"
    import AppRelation from "@/components/AppSelects/Relation/Relation.vue"

    const isShow = inject('isShow')
    const activeId = inject('activeId')
    const invalidFields = inject('invalidFields')
    const form = inject('form')
    
    const emit = defineEmits([
        'callAction'
    ])

    // Показать окно предупреждения
    const showWarning = (state) => {
        isShow.value.state = state
    } 

    // Изменение значения
    const changeValue = (id, data) => {
        let findedField = form.value.find(p => p.key == data.key)
        findedField.value = data.value
    }
</script>
