<template>
    <div class="filter" ref="filterRef">
        <FilterHeader 
            :tabs="tabs"
            @actionFilter="(data) => actionFilter(data)"
            @changeSearch="(data) => changeSearch(data)"
        />

        <FilterMenu 
            v-show="showMenu"
            @actionFilter="(data) => actionFilter(data)"
            @actionSaves="(data) => actionSaves(data)"
        />
    </div>
</template>

<script setup>
    import './Filter.scss';

    import { ref, onMounted, provide, onUnmounted } from 'vue'
    
    import _ from 'lodash'
    import FilterMenu from './FilterMenu/FilterMenu.vue';
    import FilterHeader from './FilterHeader/FilterHeader.vue';
    import renderScripts from "@/commonScripts/renderScripts/renderScripts"

    let tabs = ref([])
    let saves = ref([])
    let fields = ref([])
    let search = ref('')
    let showMenu = ref(false)
    let activeFields = ref([])
    let backupFields = ref([])
    const filterRef = ref(null)

    const props = defineProps({
        fields: {
            default: [],
            type: Array
        },
        saves: {
            default: [],
            type: Array
        },
        tabs: {
            default: null,
            type: Object
        }
    })

    const emit = defineEmits([
        'actionFilter'
    ])

    onMounted(async () => {
        saves.value = JSON.parse(JSON.stringify(props.saves))
        saves.value.sort((prev, next) => prev.sort - next.sort)
        fields.value = await renderScripts('filter', JSON.parse(JSON.stringify(props.fields)))
        document.addEventListener('mousedown', (event) => toggleMenu(event))

        if (saves.value.find(item => item.is_hidden) == undefined) {
            saves.value.push({
                id: -1,
                title: "Фильтр",
                is_hidden: 1,
                sort: 0,
                fields: []
            })
        }

        let hiddenFilter = saves.value.find(item => item.is_hidden)

        for (let field of hiddenFilter.fields) {
            let findedField = fields.value.find(item => item.key == field.key)
            findedField.enabled = true
            findedField.value = null
        }

        setTabsFields()
        activeFields.value = fields.value.filter(field => field.enabled)
    })

    const setTabsFields = () => {
        if (!_.isEmpty(props.tabs)) {
            for (let field in props.tabs) {
                let findedField = fields.value.find(item => item.key == field)
                if (findedField != undefined) {
                    findedField.enabled = true
                    findedField.value = props.tabs[field]
                }
            }

            if (props.tabs.q != undefined) {
                search.value = props.tabs.q
            }
        } else {
            for (let field of activeFields.value) {
                field.value = null
            }
        }

        activeFields.value = fields.value.filter(field => field.enabled)
        actionFilter({action: 'loadTabs', value: null})
    }

    // Включение и отключение меню
    const toggleMenu = (event = null) => {
        if (event != null &&event.target.closest('.filter') != null) {
            showMenu.value = true
        } else {
            showMenu.value = false
        }
    }

    // Изменение поиска
    const changeSearch = (data) => {
        search.value = data.value
    }

    // Действия с фильтром
    const actionFilter = (data) => {
        // Поиск по фильтру
        const searchFilter = () => {
            // Установка превью для отображения
            const setPreview = (field) => {
                if (field.type == 'date') {
                    return field.value.split('-').reverse().join('.')
                } else if (field.type == 'select_dropdown') {
                    return field.options.find(option => option.value == field.value).label
                } else if (field.type == 'relation') {
                    let findedOption = field.options.find(option => option.value == field.value)
                    return findedOption ? findedOption.label.text : null
                } else if (field.type == 'status') {
                    let label = field.options.find(option => option.value == field.value).label
                    return [null, undefined].includes(label.text) || label.text == '' ? label.color : label.text
                } else {
                    return field.value
                }
            }

            tabs.value = []

            if (![null, undefined].includes(search.value) && search.value != '') {
                tabs.value.push({
                    key: null,
                    title: 'Поиск', 
                    value: search.value,
                    preview: search.value
                })
            }

            for (let field of activeFields.value) {
                if (![null, undefined].includes(field.value) && field.value != '') {
                    tabs.value.push({
                        key: field.key,
                        title: field.title, 
                        value: field.value,
                        preview: setPreview(field)
                    })
                }
            }
        }

        // Сброс фильтра
        const clearFilter = () => {
            tabs.value = []
            search.value = null
            for (let field of activeFields.value) {
                field.value = null
            }
        }

        // Удаление скрытых плашек в фильтре
        const removeHiddenFilters = (tabs) => {
            for (let tab of tabs) {
                removeFilter(tab)
            }
        }

        // Удаление плашки в фильтре
        const removeFilter = (tab) => {
            tabs.value = tabs.value.filter((field) => field.key != tab.key)

            if (tab.key == null) {
                search.value = null
            } else {
                let field = activeFields.value.find(item => item.key == tab.key)
                if (field != undefined) {
                    field.value = null
                }
            }
        }

        // Получение объекта для отправки запроса
        const getRequest = () => {
            let request = {}

            for (let tab of tabs.value) {
                request[tab.key == null ? 'q' : tab.key] = tab.value
            }

            emit('actionFilter', {action: 'search', value: request})
        }

        // Перетаскивание полей в фильтре
        const changeOrder = () => {
            let findedFilter = saves.value.find(filter => filter.is_hidden)
            activeFields.value = data.value.fields
            findedFilter.fields = data.value.requestFields
            emit('actionFilter', {action: 'update', value: findedFilter})
        }

        // Скрытие или показ полей
        const changeEnabledField = (data) => {
            let field = fields.value.find(field => field.key === data.key)
            let hiddenFilter = saves.value.find(filter => filter.is_hidden)
            let changedFields = []

            field.enabled = data.value
            field.value = null

            activeFields.value = fields.value.filter(field => field.enabled)

            activeFields.value.forEach((elem, index) => {
                changedFields.push({
                    key: elem.key, 
                    sort: index,
                    value: null
                })
            });

            hiddenFilter.fields = changedFields

            emit('actionFilter', {action: 'update', value: hiddenFilter})
        }

        switch (data.action) {
            // Поиск по фильтру
            case 'search':
                searchFilter()
                toggleMenu(null)
                getRequest()
                break;

            // Сброс фильтра
            case 'clear':
                clearFilter()
                getRequest()
                break;

            // Удаление плашки в фильтре
            case 'removeFilter': 
                removeFilter(data.value)
                getRequest()
                break;

            // Удаление скрытых плашек в фильтре
            case 'removeHiddenFilters':
                removeHiddenFilters(data.value)
                getRequest()
                break;

            // Перетаскивание полей в фильтре
            case 'changeOrder': 
                changeOrder()
                break;

            // Скрытие или показ полей
            case 'enabledField': 
                changeEnabledField(data.value)
                break;

            case 'loadTabs': 
                searchFilter()
                break;

            default:
                break;
        }
    }
   
    // Действия с сохраненными фильтрами
    const actionSaves = (data) => {
        let findedFilter = null
        let findedFitlerIndex = null
        if (data.value != null) {
            findedFilter = saves.value.find(item => item.id == data.value.id)
            findedFitlerIndex = saves.value.findIndex(item => item.id == data.value.id)
        }

        // Смена активного фильтра
        const changeActiveFilter = (status) => {
            let findedField = null
            let newFields = false
            let hiddenFilter = saves.value.find(filter => filter.is_hidden)

            for (let field of activeFields.value) {
                field.value = null
            }

            for (let field of findedFilter.fields) {
                findedField = activeFields.value.find(item => item.key == field.key)

                if (findedField == undefined) {
                    if (![null, undefined].includes(field.value) && field.value != '') {
                        findedField = fields.value.find(item => item.key == field.key)
                        findedField.enabled = true
                        findedField.value = field.value
                        activeFields.value = fields.value.filter(field => field.enabled)
                        newFields = true
                    }
                } else {
                    findedField.value = field.value
                }

            }

            if (status) {
                actionFilter({action: 'search', value: null})
            }

            if (newFields) {
                let changedFields = []

                activeFields.value.forEach((elem, index) => {
                    changedFields.push({
                        key: elem.key, 
                        sort: index,
                        value: null
                    })
                });

                hiddenFilter.fields = changedFields
                emit('actionFilter', {action: 'update', value: hiddenFilter})
            }
        }

        // Удаление фильтра
        const deleteFilter = () => {
            saves.value = saves.value.filter(item => item.id != findedFilter.id)
            emit('actionFilter', {action: 'delete', value: findedFilter.id})
        } 

        // Редактирование фильтра
        const editFilter = () => {
            changeActiveFilter(false)    
            backupFields.value = JSON.parse(JSON.stringify(findedFilter.fields)) 
            findedFilter.edit = true
        }
        
        // Отмена редактирования фильтра
        const cancelFilter = () => {
            if (findedFilter.is_new) {
                saves.value = saves.value.filter(item => item.id != findedFilter.id)
            } else {
                findedFilter.fields = backupFields.value
                clearActionsFilter()
            }
        }

        // Сохранение фильтра
        const saveFilter = () => {
            let changedFields = []
            let localFields = null

            if (findedFilter.is_hidden) {
                localFields = activeFields.value
            } else {
                localFields = activeFields.value.filter(field => ![undefined, null].includes(field.value) && field.value != '')
            }

            for (let field of localFields) {
                changedFields.push({
                    key: field.key,
                    sort: field.sort,
                    value: field.value
                })
            }

            findedFilter.fields = changedFields
            clearActionsFilter()

            if (findedFilter.is_new) {
                emit('actionFilter', {action: 'create', value: findedFilter})
                delete findedFilter.is_new
            } else {
                emit('actionFilter', {action: 'update', value: findedFilter})
            }
        }

        // Перемещение фильтра
        const moveFilter = (position) => {
            let ids = []
            let activeSort = 0
            activeSort = findedFilter.sort

            if (position == 'up') {
                findedFilter.sort = saves.value[findedFitlerIndex-1].sort
                saves.value[findedFitlerIndex-1].sort = activeSort
            } else {
                findedFilter.sort = saves.value[findedFitlerIndex+1].sort
                saves.value[findedFitlerIndex+1].sort = activeSort
            }

            saves.value = saves.value.sort((prev, next) => prev.sort - next.sort)

            for (let save of saves.value.filter(p => !p.is_hidden)) {
                ids.push(save.id)
            }

            emit('actionFilter', {action: 'sort', value: ids})
        }

        // снятие редактирования фильтра
        const clearActionsFilter = () => {
            delete findedFilter.edit
            backupFields.value = null
        }

        // Инициализация создания фильтра
        const initCreateFilter = () => {
            let hiddenFilter = saves.value.find(item => item.is_hidden)
            let newFilter = JSON.parse(JSON.stringify(hiddenFilter))
            newFilter.id = saves.value.length
            newFilter.is_hidden = 0
            newFilter.title = null
            newFilter.is_new = true
            newFilter.edit = true
            newFilter.sort = saves.value[saves.value.length-1].id+1
            saves.value.push(newFilter)
        }

        switch (data.action) {
            // Перемещение фильтра вверх
            case 'up': 
                moveFilter('up')
                break;

            // Перемещение фильтра вниз
            case 'down': 
                moveFilter('down')
                break;

            // Редактирование фильтра
            case 'edit': 
                editFilter()
                break;

            // Удаление фильтра
            case 'delete':
                deleteFilter()
                break;

            // Сохранение фильтра
            case 'save':
                saveFilter()
                break;

            // Отмена редактирования
            case 'cancel':
                cancelFilter()
                break;

            // Смена активного фильтра
            case 'changeActiveFilter':
                changeActiveFilter(true)
                break;

            // Инициализация создания фильтра
            case 'initCreate':
                initCreateFilter()
                break
        
            default:
                break;
        }
    }

    provide('saves', saves)
    provide('search', search)
    provide('fields', fields)
    provide('activeFields', activeFields)

    onUnmounted(() => {
        saves.value = []
        fields.value = []
        document.removeEventListener('mousedown', (event) => toggleMenu(event))
    })

    watch(() => props.tabs, () => {
        setTabsFields()
    })

    watch(() => props.saves, async () => {
        saves.value = JSON.parse(JSON.stringify(props.saves))
        saves.value.sort((prev, next) => prev.sort - next.sort)
        fields.value = await renderScripts('filter', JSON.parse(JSON.stringify(props.fields)))
        if (saves.value.find(item => item.is_hidden) == undefined) {
            saves.value.push({
                id: -1,
                title: "Фильтр",
                is_hidden: 1,
                sort: 0,
                fields: []
            })
        }

        let hiddenFilter = saves.value.find(item => item.is_hidden)

        for (let field of hiddenFilter.fields) {
            let findedField = fields.value.find(item => item.key == field.key)
            findedField.enabled = true
            findedField.value = null
        }
        activeFields.value = fields.value.filter(field => field.enabled)    
    }, {deep: true})
</script>
