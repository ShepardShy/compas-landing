<template>
    <AppSection class="tile-section">
        <TileHeader 
            :permissions="props.permissions"
            :isCanRemove="props.isCanRemove"
            @callAction="(data) => callActionSection(data)"
        />

        <TileBody 
            :slug="props.slug"
            :loaderState="props.loaderState"
            @callAction="(data) => callActionFields(data)"
        />

        <TileFooter 
            @callAction="(data) => callActionFields(data)"
        />

        <TileWarning 
            :sections="props.sections"
            :loaderState="props.loaderState"
            @callAction="(data) => callActionFields(data)"
        />
    </AppSection>
</template>

<script setup>
    import './AppTileSection.scss';

    import { ref, provide, onMounted, watch, inject } from 'vue';

    import AppSection from '@/components/AppSection/AppSection.vue';

    import TileBody from './Body/Body.vue'
    import TileHeader from './Header/Header.vue'
    import TileFooter from './Footer/Footer.vue'
    import TileWarning from './Warning/Warning.vue'

    let section = ref({
        id: 0,
        title: 'Начальное название секции',
        state: false,
        fields: []
    })

    let removingField = ref(null)
    let edittingField = ref(null)

    const hiddenFields = inject('hiddenFields')
    const backupFields = inject('backupFields')
    
    let isShow = ref({
        state: false,
        type: null
    })
   
    const emit = defineEmits([
        'callAction'
    ])

    const props = defineProps({
        section: {
            default: {},
            type: Object
        },
        slug: {
            default: null,
            type: String
        },
        sections: {
            default: [],
            type: Array
        },
        isEditableSettings: {
            default: true,
            type: Boolean
        },
        loaderState: {
            default: null, 
            type: String
        },
        is_admin: {
            default: false,
            type: Boolean
        },
        userRole: {
            default: null,
            type: Boolean
        },
        pageId: {
            default: null,
            type: Number
        },
        permissions: {
            default: {},
            type: Object
        },
        isCreate: {
            default: false,
            type: Boolean
        },
        isCanRemove: {
            default: true,
            type: Boolean
        }
    })

    provide('isShow', isShow)
    provide('section', section)
    provide('hiddenFields', hiddenFields)
    provide('removingField', removingField)
    provide('edittingField', edittingField)
    provide('is_admin', props.is_admin)
    provide('userRole', props.userRole)
    provide('isEditableSettings', props.isEditableSettings)
    provide('pageId', props.pageId)

    // Действие с секцией
    const callActionSection = (data) => {
        // Изменение заголовка
        const changeTitle = (data) => {
            emit('callAction', {
                action: 'changeSectionTitle',
                value: data
            })
        }

        // Удаление секции
        const initDeleteSection = (data) => {
            emit('callAction', {
                action: 'initDeleteSection',
                value: data
            })
        }

        // Изменение состояния секции
        const changeState = () => {
            section.value.state = !section.value.state
            
            if (section.value.state) {
                section.value.fields.forEach((field) => {
                    field.isEdit = true
                    callActionFields({action: 'editField', value: field})
                })
            } else {
                section.value.fields.forEach((field) => {
                    delete field.isEdit

                    let findedBackupField = backupFields.value.find(p => p.id == field.id)
                    if (findedBackupField) {
                        field.value = findedBackupField.value
                        backupFields.value = backupFields.value.filter(p => p.id != field.id)
                    }
                })
            }
        }

        switch (data.action) {
            // Изменение состояния секции
            case 'changeState':
                changeState()
                break;

            // Изменение заголовка
            case 'changeTitle':
                changeTitle(data.value)
                break;

            // Удаление секции
            case 'delete':
                initDeleteSection(data.value)
                break;

            default:
                emit('callAction', {
                    action: data.action,
                    value: data.value
                })
                break;
        }
    }

    // Действия с полями
    const callActionFields = (data) => {
        // Получение полей
        const getFields = () => {
            section.value = JSON.parse(JSON.stringify(props.section))
            section.value.state = false
        }

        // Изменить видимость поля
        const changeVisibleField = (data) => {
            if (data.state == 'hidden') {
                hiddenFields.value.push(data.field)
                section.value.fields = section.value.fields.filter(field => field.id != data.field.id)
                emit('callAction', {
                    action: 'changeHiddenFields',
                    value: hiddenFields.value.map((field) => field.id),
                    section_id: section.value.id
                })
            } else if (data.state == 'visible') {
                section.value.fields.push(data.field)
                hiddenFields.value = hiddenFields.value.filter(field => field.id != data.field.id)

                emit('callAction', {
                    action: 'changeVisibleField',
                    value: data.field,
                    section_id: section.value.id
                })
            }
        }

        // Открытие модального окна для создания поля
        const initCreateField = () => {
            edittingField.value = {
                options: [],
                section_id: section.value.id,
                roles_read: [],
                roles_write: [],
                has_roles_read: 0,
                has_roles_write: 0,
                title: null,
                type: 'text',
                visible_always: 1,
                is_plural: 0,
                is_external_link: 0,
                required: 0,
                set_color: 0,
                color: '#000',
                unit: null,
                entity: props.slug
            }

            isShow.value = {
                state: true,
                type: 'create'
            }
        }

        // Создание поля
        const createField = (field) => {
            field.can_edit = 1
            emit('callAction', {
                action: 'createField',
                value: JSON.parse(JSON.stringify(field))
            })

            isShow.value = {
                state: false,
                type: null
            }
        }

        // Инициализация удаления поля
        const initDelete = () => {
            removingField.value = data.value
            isShow.value = {
                state: true,
                type: 'delete'
            }
        }

        //Удаление поля
        const removeField = () => {
            isShow.value = {
                state: false,
                type: null
            }

            section.value.fields = section.value.fields.filter(field => field.id != removingField.value.id)

            emit('callAction', {
                action: 'removeField',
                value: removingField.value.id
            })

            removingField.value = null
        }
        
        // Перемещение полей между секциями
        const changeOrder = (value) => {
            emit('callAction', {
                action: 'changeOrder',
                value: value
            })
        }

        // Настройки поля
        const editSettingsField = (field) => {
            isShow.value = {
                state: true,
                type: 'settings'
            }
            edittingField.value = JSON.parse(JSON.stringify(field))
            edittingField.value.section_id = section.value.id
        }

        // Обновление настроек поля
        const updateField = (keys) => {
            let findedField = section.value.fields.find(field => field.id == keys.id)

            for (let key in keys) {
                findedField[key] = keys[key]
            }

            emit('callAction', {
                action: 'updateField',
                value: keys,
                isEdit: findedField.isEdit,
                fieldValue: findedField.value
            })
        }

        // Редактирование секции
        const editField = (field) => {
            if (!backupFields.value.find(p => p.id == field.id)) {
                backupFields.value.push(JSON.parse(JSON.stringify(field)))
            }

            emit('callAction', {
                action: 'editField',
                value: field
            })
        }

        // Поиск опций
        const searchOptions = async (data) => {
            let findedField = section.value.fields.find(p => p.key == data.key)
            
            if (findedField.url == null) {
                let propsField = props.section.fields.find(p => p.key == data.key)
                findedField.options = propsField.options.filter(p => p.label.text.toLowerCase().includes(data.value.toLowerCase()))
            } else {
                // let response = await api.callMethod("GET", `${findedField.url}&${findedField.urlKey}=${data.value.toLowerCase()}`)
                findedField.options = response.map(option => option = {
                    label: {
                        text: option
                    },
                    value: option
                })
            }
         }

        switch (data.action) {
            // Получение полей
            case 'getFields':
                getFields()
                break;

            // Изменить видимость поля
            case 'changeVisibleField':
                changeVisibleField(data.value)
                break;

            // Открытие модального окна  для создания поля
            case 'initCreateField':
                initCreateField()
                break;

            // Создание поля
            case 'createField':
                createField(data.value)
                break;

            // Перемещение полей между секциями
            case 'changeOrder':
                changeOrder(data.value)
                break;

            // Инициализация удаления поля
            case 'initDelete':
                initDelete(data.value)
                break;

            //Удаление поля
            case 'delete':
                removeField(data.value)
                break;

            // Настройки поля
            case 'editSettings':
                editSettingsField(data.value)
                break;

            // Изменение настроек поля
            case 'updateField':
                updateField(data.value)
                break;

            case 'editField':
                editField(data.value)
                break;

            case 'searchOptions':
                searchOptions(data.value)
                break;

            default:
                emit('callAction', data)
                break;
        }
    }

    onMounted(() => {
        callActionFields({
            action: 'getFields'
        })

        if (props.isCreate) {
            callActionSection({
                action: 'changeState',
                value: true
            })
        }
    })

    watch(props.section, () => {
        callActionFields({
            action: 'getFields'
        })
    }, {
        deep: true
    })

    watch(() => props.loaderState, (next, prev) => {
        if (prev == 'updateField' && next == null) {
            isShow.value = {
                state: false,
                type: null
            }
        }
    })  
</script>
