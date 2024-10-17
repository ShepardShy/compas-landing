<template>
    <div class="table-template__header table-top">
        <slot name="top"></slot>

        <div class="table__title">
            {{ props.tableTitle }}
        </div>

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
                @changeValue="(data) => sortItem = scripts.sortTable(emit, sortItem, data)"
            />
            <PopupSave 
                class="table-top__item"
                v-show="menu?.saves.isShow"
                @saveSettings="(role) => scripts.saveSettings(emit, tableRef, fields, sortItem, menu, role)"
            />
            <AppPopup :isCanSelect="false" class="table-top__item table-top__item_excel" v-if="is_admin || props.permissions.export_p != 'N'" :closeByClick="true">
                <template #summary>
                    <IconDots />
                </template>
                <template #content>
                    <PopupOption @click="() => scripts.downloadExcel(emit, fields)">
                        Скачать Excel
                    </PopupOption>
                </template>
            </AppPopup>
            <AppPopup :isCanSelect="false" class="table-top__item table-top__item_settings" :closeByClick="false" @clickOutside="() => changeTab(null)">
                <template #summary>
                    <IconSettings />
                </template>
                <template #content>
                    <template v-if="menu?.activeTab == null">
                        <template v-for="tab in menu?.tabs">
                            <PopupOption class="popup-option__sublink" v-if="tab.isAction" @click="(event) => tabAction(event, tab)">
                                {{ tab.title }} 
                            </PopupOption>
                            <PopupOption class="popup-option__sublink" v-else @click="() => changeTab(tab)">
                                {{ tab.title }} 
                                
                                <IconArrow />
                            </PopupOption>
                        </template>
                    </template>
                    <template v-else>
                        <PopupOption class="popup-option__sublink popup-option__sublink_back" @click="() => changeTab(null)">
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
                                @end="(event) => fields.value = scripts.setColumnAfterDragEnd(fields, tableRef, menu, event)" 
                                @start="(event) => draggableRef.targetDomElement.classList.add('popup-option__draggable_dragging')" 
                            >
                                <template #item="{ element: option }">
                                    <PopupOption class="popup-option__sublink" v-show="option.enabled" @dragstart="(event) => commonScripts.cloningDraggableComponent(event, ['popup-option__draggable'])">
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
                                    @changeValue="(data) =>  fields = scripts.changeVisibleColumn(fields, menu, tableRef, data)"
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

    import IconDots from '@/components/AppIcons/Dots/Dots.vue'
    import IconDrag from '@/components/AppIcons/Drag/Drag.vue'
    import IconArrow from '@/components/AppIcons/Arrow/Arrow.vue'
    import IconSettings from '@/components/AppIcons/Settings/Settings.vue'
    
    import scripts from './scripts.js'
    import draggable from 'vuedraggable'
    import PopupScripts from '@/components/AppPopup/Scripts.js'
    import AppPopup from '@/components/AppPopup/Popup.vue';
    import PopupSave from '@/components/AppPopup/Save/Save.vue';
	import commonScripts from '@/commonScripts/commonScripts.js'
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    let options = ref([])
    const draggableRef = ref(null) 
    
    const menu = inject('menu')
    const fields = inject('fields')
    const sortItem = inject('sortItem')
    const tableRef = inject('tableRef')
    const is_admin = inject('is_admin')
    const isMobile = inject('isMobile')
    
    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        tableTitle: {
            default: null,
            type: String
        },
        permissions: {
            default: {},
            type: Object
        }
    })

    onMounted(() => {
        options.value = scripts.setMobileSortOptions(fields.value)  
    })

    // Смена активной вкладки
    const changeTab = (tab) => {
        setTimeout(() => {
            menu.value.changeTab(tab)
        }, 10);
    }

    const tabAction = (event, tab) => {
        PopupScripts.hideDetails(event.target.closest('.table-top__item_settings'))
        emit('callAction', {
            action: tab.action,
            value: null
        })
    }

    watch(() => fields.value, async () => {
        options.value = await scripts.setMobileSortOptions(fields.value)  
    })
</script>
