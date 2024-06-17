<template>
    <div class="table-template__header table-top">
        <caption class="table__title">
            {{ props.tableTitle }}
        </caption>

        <div class="table-top__actions">
            <AppSelect 
                v-if="isMobile"
                class="table-top__item table-top__select"
                :class="sortItem.order == 'asc' ? 'table-top__select_up' : ''"
                :item="{
                    id: 0,
                    key: 'sortTable',
                    value: sortItem.key,
                    focus: false,
                    required: false,
                    title: null,
                    lockedOptions: [],
                    options: options
                }"
                :isFiltered="false"
                :isMultiple="false"
                :isReadOnly="false"
                :isHaveNullOption="false"
                @changeValue="(data) => sortTable(data)"
            />
            <PopupSave 
                class="table-top__item"
                v-show="menu.saves.isShow"
                @saveSettings="(role) => callAction({action: 'saveSettings', value: role})"
            />
            <AppPopup :isCanSelect="false" class="table-top__item table-top__item_excel" v-if="is_admin || permissions.export_p != 'N'" :closeByClick="true">
                <template #summary>
                    <IconDots />
                </template>
                <template #content>
                    <PopupOption @click="() => callAction({action: 'downloadExcel', value: null})">
                        Скачать Excel
                    </PopupOption>
                </template>
            </AppPopup>
            <AppPopup :isCanSelect="false" class="table-top__item" :closeByClick="false" @clickOutside="() => callAction({action: 'changeTab', value: null})">
                <template #summary>
                    <IconSettings />
                </template>
                <template #content>
                    <template v-if="menu.activeTab == null">
                        <PopupOption class="popup-option__sublink" v-for="tab in menu.tabs" @click="() => callAction({action: 'changeTab', value: tab})">
                            {{ tab.title }} 
                            
                            <IconArrow />
                        </PopupOption>
                    </template>
                    <template v-else>
                        <PopupOption class="popup-option__sublink popup-option__sublink_back" @click="() => callAction({action: 'changeTab', value: null})">
                            {{ menu.activeTab.title }}
                            
                            <IconArrow />
                        </PopupOption>

                        <template v-if="menu.activeTab.tab == 'order'">
                            <draggable 
                                ref="draggableRef"
                                class="popup-option__draggable"
                                group="table-top__item" 
                                itemKey="table-top__item"
                                v-model="fields" 
                                handle=".icon__draggable"
                                @end="(event) => callAction({action: 'dragEnd', value: event})" 
                                @start="(event) => callAction({action: 'dragStart', value: event})" 
                            >
                                <template #item="{ element: option }">
                                    <PopupOption class="popup-option__sublink" v-show="option.enabled" @dragstart="(event) => callAction({action: 'cloningDraggableComponent', event: event})">
                                        <IconDrag /> 
                                        {{ option.title }}
                                    </PopupOption>
                                </template>
                            </draggable>
                        </template>
                        <template v-else>
                            <PopupOption class="popup__option_checkbox" v-for="option in menu.activeTab.tab == 'enabled' ? fields : fields.filter(p => p.enabled)">
                                <AppCheckbox 
                                    :item="{
                                        id: option.id,
                                        title: option.title,
                                        type: 'checkbox',
                                        disabled: false, 
                                        value: menu.activeTab.tab == 'enabled' ? option.enabled : option.fixed,
                                        options:  null,
                                        key: option.key                           
                                    }"
                                    @changeValue="(data) => callAction({action: 'changeValue', value: data})"
                                />                            
                            </PopupOption>
                        </template>
                    </template>
                </template>
            </AppPopup>
        </div>
    </div>
</template>

<script setup>
    import './Top.scss';

    import { ref, inject, onMounted, watch } from 'vue'

    import IconDots from '@/components/AppIcons/Dots/Dots.vue'
    import IconDrag from '@/components/AppIcons/Drag/Drag.vue'
    import IconArrow from '@/components/AppIcons/Arrow/Arrow.vue'
    import IconSettings from '@/components/AppIcons/Settings/Settings.vue'
    
    import draggable from 'vuedraggable'
    import resizeTable from '../Header/resizeTable.js'
    import AppPopup from '@/components/AppPopup/Popup.vue';
    import PopupSave from '@/components/AppPopup/Save/Save.vue';
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';
    
    const draggableRef = ref(null)
    
    let options = ref([])
    
    const menu = inject('menu')
    const fields = inject('fields')
    const sortItem = inject('sortItem')
    const tableRef = inject('tableRef')
    const permissions = inject('permissions')
    const is_admin = inject('is_admin')
    const isMobile = inject('isMobile')
    
    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        tableTitle: {
            default: null,
            type: String
        }
    })

    onMounted(() => {
        setOptions()
    })

    // Действия с шапкой
    const callAction = (data) => {
        // Смена активной вкладки
        const changeTab = (tab) => {
            setTimeout(() => {
                menu.value.activeTab = tab
            }, 10);
        }

        // Изменение значений опций
        const changeValue = (data) => {
            let findedOption = fields.value.find(option => option.key == data.key)
            findedOption[menu.value.activeTab.tab] = data.value
            showSaves(true)
            
            setTimeout(() => {
                let findedCell = tableRef.value.querySelector(`th[data-key="${data.key}"]`)
                if (findedCell.offsetWidth <= 50) {
                    findedCell.querySelector('span').style.display = 'none'
                } else {
                    findedCell.querySelector('span').style.display = 'flex'
                }
            }, 10);
        }

        // Начало перетаскивания опции
        const dragStart = () => {
            draggableRef.value.targetDomElement.classList.add("popup-option__draggable_dragging")
        }

        // Конец перетаскивания опции
        const dragEnd = (value) => {
            fields.value = value.to.__draggable_component__.modelValue
            let row = tableRef.value.querySelector('tr');
            let cols = row ? row.children : undefined;
            resizeTable.setDefaultWidth(cols, fields.value)
            showSaves(true)

            document.querySelectorAll('#clone-elem').forEach(element => {
                element.remove()
            });
        }

        // Сохранение настроек полей для выбранной роли
        const saveSettings = (role) => {
            showSaves(false)
            emit('callAction', {
                action: 'saveFields', 
                value: {
                    sortItem: sortItem.value,
                    role: role, 
                    fields: fields.value
                }
            })
        }

        // Открытие/скрытие окна сохранения
        const showSaves = (state) => {
            menu.value.saves.isShow = state
        }

        // Скачивание экселя
        const downloadExcel = () => {
            let localFields = []

            for (let field of fields.value.filter(item => item.enabled)) {
                localFields.push(`fields[]=${field.key}`)
            }

            emit('callAction', {
                action: 'downloadExcel',
                value: localFields
            })
        }

        // Клонирование перетаскиваемого элемента c созданием родителя
        const cloningDraggableComponent = (event) => {
            let parentElem = document.createElement("div")
            let elem = event.target.cloneNode(true)
            parentElem.appendChild(elem)
            parentElem.id = "clone-elem";
            parentElem.classList.add('clone-elem')
            parentElem.classList.add('popup-option__draggable')
            elem.style.width = `${ event.target.offsetWidth}px`
            document.body.appendChild(parentElem);
            event.dataTransfer.setDragImage(parentElem, 5, 8);
        }

        switch (data.action) {
            // Смена активной вкладки
            case "changeTab":
                changeTab(data.value)
                break;

                // Конец перетаскивания опции
            case "dragStart":
                dragStart()
                break;

                // Начало перетаскивания опции
            case "dragEnd":
                dragEnd(data.value)
                break;

            // Изменение значений опций
            case "changeValue":
                changeValue(data.value)
                break;

            // Открытие/скрытие окна сохранения
            case 'saveSettings':
                saveSettings(data.value)
                break;

            // Открытие/скрытие окна сохранения
            case "showSaves":
                showSaves(data.value)
                break;

            // Скачивание экселя
            case 'downloadExcel':
                downloadExcel()
                break;
                
            // Клонирование перетаскиваемого элемента c созданием родителя
            case 'cloningDraggableComponent':
                cloningDraggableComponent(data.event)
                break;
            default:
                break;
        }
    }

    // Сортировка таблицы
    const sortTable = (data) => {
        if (data.value == sortItem.value.key) {
            sortItem.value.order = sortItem.value.order == 'asc' ? 'desc' : 'asc'
        } else {
            sortItem.value.key = data.value
            sortItem.value.order = 'desc'
        }

        emit('callAction', {
            action: 'getTableData',
            value: null
        })
    }

    // Установка полей для сортировке в мобильной версии
    const setOptions = () => {
        let localFields = JSON.parse(JSON.stringify(fields.value))
        let localOptions = []

        for (let field of localFields) {
            localOptions.push({
                label: field.title,
                value: field.key
            })
        }

        options.value = localOptions.filter(p => !['isChoose', 'actions', 'iconDelete', 'iconDrag'].includes(p.value))
    }

    watch(() => fields.value, () => {
        setOptions()
    })
</script>
