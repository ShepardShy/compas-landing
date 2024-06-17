<template>
    <draggable 
        v-if="activeFields.length > 0"
        class="filter__fields"
        group="filter-fields" 
        itemKey="filter-fields"
        v-model="activeFields" 
        handle=".icon__draggable"
        @start="(event) => dragStart(event)" 
        @end="(event) => dragEnd(event)" 
    >
        <template #item="{ element: field }">
            <div class="filter__field" @dragstart="(event) => cloningDraggableComponent(event)">
                <IconDrag />
                <component 
                    :is="field.component"
                    :item="{
                        id: field.id,
                        title: field.title,
                        type: field.type,
                        read_only: Boolean(field.read_only),
                        can_edit: Boolean(field.can_edit),
                        color: field.color,
                        is_plural: Boolean(field.is_plural),
                        required: Boolean(field.required),
                        key: field.key,
                        value: field.value,
                        enabled: Boolean(field.enabled),
                        options: field.options,
                        lockedOptions: []
                    }"
                    :isHaveNullOption="true"
                    :enabledAutocomplete="false"
                    @changeValue="(data) => changeValue(data)"
                    @searchOptions="(data) => searchOptions(data)"
                />

                <AppPopup :closeByClick="true" :isCanSelect="false">
                    <template #summary> 
                        <IconSettings />
                    </template>
                    <template #content>
                        <PopupOption @click="() => hideField(field)">
                            Скрыть
                        </PopupOption>
                    </template>
                </AppPopup>
            </div>
        </template>
    </draggable>

    <div v-else class="filter__fields filter__fields_empty">
        Нет активных полей
    </div>
</template>

<script setup>
    import './Fields.scss';

    import { inject } from 'vue'
    import draggable from 'vuedraggable'

    import AppPopup from '@/components/AppPopup/Popup.vue'
    import IconDrag from '@/components/AppIcons/Drag/Drag.vue'
    import IconSettings from '@/components/AppIcons/Settings/Settings.vue'
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue'
    
    import commonScripts from '@/commonScripts/commonScripts.js'

    const activeFields = inject('activeFields')

    const emit = defineEmits([
        'actionFilter',
    ])

    // Изменение значения в поле
    const changeValue = (data) => {
        let field = activeFields.value.find((field) => field.key === data.key)
        field.value = data.value
    }

    // Поиск опций
    const searchOptions = async (data) => {
        let findedField = activeFields.value.find((field) => field.key === data.key)
        let request = await commonScripts.getInfoAutocomplete(data.value.toLowerCase(), findedField.id)
        findedField.options = request
    }

    // Скрытие поля
    const hideField = (field) => {
        emit('actionFilter', {action: 'enabledField', value: {
            value: !field.enabled, 
            key: field.key
        }})
    }

    // Начало переноса поля
    const dragStart = (event) => {
        event.from.classList.add('filter__fields_dragging')
    }

    // Изменение порядка полей
    const dragEnd = (event) => {
        let data = []

        event.to.__draggable_component__.modelValue.forEach((element, index) => {
            data.push({
                sort: index,
                value: null,
                key: element.key
            })
        });

        emit('actionFilter', {action: 'changeOrder', value: {fields: event.to.__draggable_component__.modelValue, requestFields: data}})

        document.querySelectorAll('#clone-elem').forEach(element => {
            element.remove()
        });

        setTimeout(() => {
            event.from.classList.remove('filter__fields_dragging')
        }, 100);
    }

    // Клонирование перетаскиваемого элемента c созданием родителя
    const cloningDraggableComponent = (event) => {
        let parentElem = document.createElement("div")
        let elem = event.target.cloneNode(true)
        parentElem.appendChild(elem)
        parentElem.id = "clone-elem";
        parentElem.classList.add('clone-elem')
        parentElem.classList.add('filter__fields')
        elem.style.width = `${ event.target.offsetWidth}px`
        document.body.appendChild(parentElem);
        event.dataTransfer.setDragImage(parentElem, 5, 8);
    }
</script>
