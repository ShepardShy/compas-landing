<template>
    <div class="tabs">
        <div class="tabs__list">
            <template v-for="tab in tabs.filter(p => p.enabled)">
                <AppPopup 
                    v-if="tab.childs != undefined"
                    class="popup__tabs" 
                    :closeByClick="true" 
                    :isCanSelect="false"
                    :class="tab.childs.find(p => p.alias == activeTab.tab) != undefined ? 'tabs__item_active' : '', props.isCanChange == false ? 'tabs__item_disabled' : ''" 
                >
                    <template #summary>
                        <div class="tabs__item">
                            <IconTriangle />
                            {{ tab.title }}
                        </div>
                    </template>
                    <template #content>
                        <PopupOption 
                            v-for="child in tab.childs" 
                            :class="child.alias == activeTab.tab ? 'popup__option_active' : ''" 
                            @click="() => child.alias == activeTab.tab ? null : callAction({action: 'changeTab', value: child.alias, type: 'module'})"
                        >
                            {{ child.title }}
                        </PopupOption>
                    </template>
                </AppPopup>
                <div 
                    v-else 
                    class="tabs__item" 
                    :class="activeTab.tab == tab.tab ? 'tabs__item_active' : '', !props.isCanChange ? 'tabs__item_disabled' : ''"
                >
                    <span class="tabs__item-text" @click="() => activeTab.tab == tab.tab ? null : callAction({action: 'changeTab', value: tab.tab})">
                        {{ tab.title }}
                    </span>

                    <AppPopup class="popup__actions" :isCanSelect="false" :closeByClick="true" v-if="props.haveSettings && Boolean(props.is_admin)">
                        <template #summary>
                            <IconSettings />
                        </template>
                        <template #content>
                            <PopupOption @click="() => showSettingsTab(tab)">
                                Настроить
                            </PopupOption>
                            <PopupOption @click="() => callAction({action: 'hideTab', value: tab})">
                                Скрыть
                            </PopupOption>
                        </template>
                    </AppPopup>
                </div>
            </template>
        </div>
        
        <div class="tabs__actions">
            <PopupSave 
                v-show="settingsTabs.saves.isShow"
                @saveSettings="(role) => callAction({action: 'saveSettings', value: role})"
            />
            <AppPopup class="popup__settings" :isCanSelect="false" :closeByClick="false" @clickOutside="() => callAction({action: 'changeSettingsTab', value: null})">
                <template #summary>
                    <IconSettings />
                </template>
                <template #content>
                    <template v-if="settingsTabs.activeTab == null">
                        <PopupOption 
                            class="popup-option__sublink" 
                            v-for="tab in settingsTabs.tabs"
                            @click="() => callAction({action: 'changeSettingsTab', value: tab})"
                        >
                            {{ tab.title }} 
                            
                            <IconArrow />
                        </PopupOption>
                    </template>
                    <template v-else>
                        <PopupOption 
                            class="popup-option__sublink popup-option__sublink_back" 
                            @click="() => callAction({action: 'changeSettingsTab', value: null})"
                        >
                            {{ settingsTabs.activeTab.title }}
                            <IconArrow />
                        </PopupOption>

                        <template v-if="settingsTabs.activeTab.tab == 'order'">
                            <draggable 
                                ref="draggableRef"
                                class="popup-option__draggable"
                                group="popup-menu__settings" 
                                itemKey="settings-visible"
                                v-model="tabs" 
                                handle=".icon__draggable"
                                @end="(event) => callAction({action: 'dragEnd', value: event})" 
                            >
                                <template #item="{ element: option }">
                                    <PopupOption @dragstart="(event) => copyField(event)" class="popup-option__sublink" v-show="option.enabled">
                                        <IconDrag /> 
                                        {{ option.title }}
                                    </PopupOption>
                                </template>
                            </draggable>
                        </template>
                        <template v-else>
                            <PopupOption class="popup__option_checkbox" v-for="option in tabs">
                                <AppCheckbox 
                                    :item="{
                                        id: option.id,
                                        title: option.title,
                                        type: 'checkbox',
                                        disabled: false, 
                                        value: option.enabled,
                                        options:  null,
                                        key: option.tab                           
                                    }"
                                    @changeValue="(data) => callAction({action: 'changeValue', value: data})"
                                />                            
                            </PopupOption>
                        </template>
                    </template>
                </template>
            </AppPopup>
        </div>

        <AppWarning 
            @callAction="(data) => callAction(data)"
        />
    </div>
</template>

<script setup>
    import './Tabs.scss';
    
    import { onMounted, ref, inject } from 'vue'
    import draggable from 'vuedraggable'

    import IconDrag from '@/components/AppIcons/Drag/Drag.vue'
    import IconArrow from '@/components/AppIcons/Arrow/Arrow.vue'
    import IconSettings from '@/components/AppIcons/Settings/Settings.vue'
    import IconTriangle from '@/components/AppIcons/Triangle/Triangle.vue'

    import AppPopup from '@/components/AppPopup/Popup.vue'
    import PopupSave from '@/components/AppPopup/Save/Save.vue'
    import AppCheckbox from '@/components/AppInputs/Checkbox/Checkbox.vue'
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue'
    import AppWarning from './Warning/Warning.vue'

    const props = defineProps({
        tabs: {
            default: [],
            type: Object
        },
        is_admin: {
            default: false,
            type: Boolean
        },
        haveSettings: {
            default: true,
            type: Boolean
        },
        userRole: {
            default: null,
            type: Number
        }, 
        isCanChange: {
            default: true,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    let activeTab = inject('activeTab')
    let settingsTab = ref(null)
    let isShow = ref({
        state: false,
        type: null
    })

    let tabs = ref([])

    provide('isShow', isShow)
    provide('settingsTab', settingsTab)

    let settingsTabs = ref({
        tabs: [
            {
                tab: 'enabled',
                title: 'Отображение',
            },
            {
                tab: 'order',
                title: 'Порядок',
            }
        ],
        saves: {
            isShow: false
        },
        activeTab: null
    })

    // Копирование секции
    const copyField = (event) => {
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

    // Вызов действий
    const callAction = (data) => {
        // Изменение меню в настройках
        const changeSettingsTab = (data) => {
            setTimeout(() => {
                settingsTabs.value.activeTab = data            
            }, 10);

        }

        // Сохранение настроек
        const saveSettings = (data) => {
            const transformTabs = () => {
                let request = JSON.parse(JSON.stringify(tabs.value))
                for (let tab of request) {
                    if (!tab.has_roles_read) {
                        tab.roles_read = []
                    }
                }
                return request
            }

            emit('callAction', {
                action: 'saveSettings',
                value: {
                    fields: transformTabs(),
                    role: data
                }
            })
            isShow.value.state = false
            settingsTabs.value.saves.isShow = false
        }

        // Изменение значений опций
        const changeValue = (data) => {
            tabs.value.find(option => option.tab == data.key).enabled = data.value
            settingsTabs.value.saves.isShow = true
        }

        // Скрытие вкладки
        const hideTab = (tab) => {
            tabs.value.find(p => p.id == tab.id).enabled = false
            settingsTabs.value.saves.isShow = true
        }

        // Смена вкладки
        const changeTab = (data, type = null) => {
            activeTab.value.tab = data
            activeTab.value.type = type
            emit('callAction', {
                action: 'changeTab',
                value: data,
                type: type
            })
        }

        // Конец перетаскивания плашки
        const settingsDragEnd = () => {
            settingsTabs.value.saves.isShow = true

            document.querySelectorAll('#clone-elem').forEach(element => {
                element.remove()
            });
        }

        switch (data.action) {
            // Сохранение настроек
            case 'saveSettings':
                saveSettings(data.value)
                break;

            // Изменение меню в настройках
            case 'changeSettingsTab':
                changeSettingsTab(data.value)
                break;
            
            // Изменение значений опций
            case 'changeValue':
                changeValue(data.value)
                break;

            // Конец перетаскивания плашки
            case 'dragEnd':
                settingsDragEnd(data.value)
                break;

            // Смена вкладки
            case 'changeTab': 
                changeTab(data.value, data.type)
                break;

            // Скрытие вкладки
            case 'hideTab':
                hideTab(data.value)
                break;

            default:
                break;
        }
    }

    const showSettingsTab = (tab) => {
        isShow.value = {
            type: 'updateTabs',
            state: true
        }
        settingsTab.value = tab
    }

    const setTabs = () => {
        tabs.value = props.tabs
        activeTab.value.tab = Array.isArray(tabs.value) ? tabs.value.length > 0 ? tabs.value[0].tab : null : null
    }

    onMounted(() => { 
        setTabs()
    })

    watch(() => props.tabs, () => {
        setTabs()
    }, {
        deep: true
    })
</script>
