<template>
    <td 
        ref="itemRef" 
        class="table__item"
        :style="`--colorItem: ${Boolean(props.item.set_color) ? props.item.color : '#000'}; --defaultWidth: ${props.item.width};`"
        :data-key="props.item.key" 
        :class="[
            `table__item_${props.item.type}`,
            props.item.fixed ? 'table__item_fixed' : '', 
            item.fixed ? 'table__item_pseudo-fixed' : '', 
            !props.item.enabled ? 'table__item_hidden' : '',
            props.item.isUpdated ? 'table__item_updated' : ''
        ]" 
        @click="(event) => doubleClick(event, props.row)" 
    >
        <div class="table-item__content" :class="`table-item__content_${props.item.type}`">
                <AppCheckbox 
                    v-if="props.item.type == 'checkbox'"
                    :item="{
                        isHTML: false,
                        id: props.row.id,
                        key: props.item.key,
                        title: props.item.title,
                        value: props.row[props.item.key],
                        required: Boolean(props.item.required)
                    }"
                    :disabled="actionState == 'saving'"
                    @changeValue="(data) => changeValue(props.rowId, data)"
                />

                <ButtonPayment 
                    v-else-if="props.item.type == 'payment'"
                    :item="{
                        id: props.row.id,
                        value: props.row[props.item.key] ? props.row[props.item.key].value : null,
                        state: props.row[props.item.key] ? props.row[props.item.key].state : null,
                        key: props.item.key,
                        title: props.item.title,
                        isCanClick: props.item.can_edit
                    }"
                    @initPayment="(data) => emit('callAction', {action: 'initPayment', value: {
                        id: props.row.id,
                        value: data.value
                    }})"
                />

                <AppRelation 
                    v-else-if="props.item.type == 'relation'"
                    :item="{
                        focus: false,
                        id: props.item.id,
                        placeholder: null,
                        key: props.item.key,
                        title: props.item.title,
                        value: props.row[props.item.key],
                        anotherKey: isDinamyc ? 'product_name' : null,
                        anotherTitle: isDinamyc ? props.row.product_name : null,
                        related_table: props.item.related_table,
                        required: Boolean(props.item.required),
                        options: ['status', 'relation'].includes(props.item.type) ? props.item.options : null,
                        lockedOptions: props.item.choosed,
                    }"
                    :isAnotherTitle="isDinamyc"
                    :isCanCreate="Boolean(props.item.can_create)"
                    :isCanEdit="Boolean(props.item.can_edit)"
                    :isMultiple="Boolean(props.item.is_plural)"
                    :isReadOnly="Boolean(props.item.read_only || (!props.row.isEdit && !props.isPermanentEdit))"
                    :isHaveLink="props.item.key != 'role_id'"
                    @changeValue="(data) => changeValue(props.rowId, data)"
                    @openLink="(data) => callAction({action: 'openLink', value: {id: data.id, slug: props.item.related_table}})"
                    @showAll="() => callAction({action: 'openLink', value: {id: props.row.id, slug: props.slug, tab: props.item.related_table}})"
                    @createOption="() => emit('callAction', {action: 'createOption', value: props.item.related_table})"
                />
                <AppTextarea 
                    v-else-if="['number', 'password', 'text'].includes(props.item.type) && (!isDinamyc || (isDinamyc && props.item.key != 'product_sum'))"
                    :item="{
                        focus: false,
                        id: props.row.id,
                        placeholder: null,
                        key: props.item.key,
                        type: props.item.type,
                        title: props.item.title,
                        substring: props.item.unit,
                        required: Boolean(props.item.required),
                        external_link: ![null, undefined].includes(props.row[props.item.key]) && props.row[props.item.key] != '' ? props.row[props.item.key].external_link : null,
                        value: [null, undefined].includes(props.row[props.item.key]) ? null : typeof props.row[props.item.key] == 'object' ? [null, undefined].includes(props.row[props.item.key].value) ? null : String(props.row[props.item.key].value) : String(props.row[props.item.key]),
                    }"
                    :class="Boolean(props.item.read_only || (!props.row.isEdit && !props.isPermanentEdit)) ? 'table-item__content_read-only' : ''"
                    :disabled="false"
                    :isUseEnter="false"
                    :isTableItem="true"
                    :mask="props.item.mask"
                    :isLink="Boolean(props.item.is_external_link)"
                    :isReadOnly="Boolean(props.item.read_only || (!props.row.isEdit && !props.isPermanentEdit))"
                    @changeValue="(data) => changeValue(props.rowId, data)"
                />
                <FormValue 
                    v-else-if="item.type == 'json'"
                    :isHTML="true"
                    :value="props.row[props.item.key]"
                    :isLink="Boolean(props.item.is_external_link)"
                    :link="typeof props.row[props.item.key] == 'object' && props.row[props.item.key] != null ? props.row[props.item.key].external_link : null"
                />
                <FormValue 
                    v-else-if="isDinamyc && props.item.key == 'product_sum'"
                    :isHTML="true"
                    :value="calcSum"
                    :isLink="Boolean(props.item.is_external_link)"
                    :link="typeof props.row[props.item.key] == 'object' && props.row[props.item.key] != null ? props.row[props.item.key].external_link : null"
                />
                <AppActions
                    v-else-if="item.type == 'actions'"
                    :item="{
                        title: 'Действие',
                        slug: props.row.isEdit ? 'edit' : props.actionType
                    }"
                    :objId="props.row.id"
                    :disabled="!props.row.isChoose && actionState == 'saving'"
                    :permissions="props.permissions"
                    :userID="userID"
                    :is_admin="is_admin"
                    :relationID="props.row.user_id ? props.row.user_id.value : null"
                    @callAction="(data) => callAction({action: data.value, value: row})"
                />
                <AppStatus 
                    v-else-if="props.item.type == 'status'"
                    :item="{
                        focus: false,
                        id: props.item.id,
                        key: props.item.key,
                        title: props.item.title,
                        options: props.item.options,
                        value: props.row[props.item.key],
                        required: Boolean(props.item.required),
                    }"
                    :isCanCreate="false"
                    :isHaveNullOption="false"
                    :isReadOnly="Boolean(props.item.read_only || (!props.row.isEdit && !props.isPermanentEdit))"
                    @changeValue="(data) => changeValue(props.rowId, data)"
                />
                <AppSelect 
                    v-else-if="props.item.type == 'select_dropdown'"
                    :item="{
                        id: props.item.id,
                        key: props.item.key,
                        value: props.row[props.item.key],
                        focus: false,
                        required: Boolean(props.item.required),
                        title: props.item.title,
                        options: props.item.options,
                        lockedOptions: []
                    }"
                    :isReadOnly="Boolean((props.item.read_only || !props.row.isEdit) || (isDymanic && props.item.read_only))"
                    :isHaveNullOption="Boolean(props.item.have_null_option) ?? true"
                    :isMultiple="Boolean(props.item.is_plural)"
                    :isFiltered="true"
                    @changeValue="(data) => changeValue(props.rowId, data)"
                />
                <AppFile 
                    v-else-if="props.item.type == 'file'"
                    :item="{
                        id: props.row.id,
                        title: props.item.title,
                        key: props.item.key,
                        required: Boolean(props.item.required),
                        buttonName: null,
                        value: props.row[props.item.key]
                    }"
                    :isReadOnly="true"
                    :isShowFileName="false"
                    :isMultiple="false"
                    :isOneFile="true"
                    @changeValue="(data) => changeValue(props.rowId, data)"
                />
                <AppDate 
                    v-else-if="props.item.type == 'date'"
                    :item="{
                        id: props.row.id,
                        required: Boolean(props.item.required),
                        title: props.item.title,
                        placeholder: null,
                        value: props.row[props.item.key],
                        key: props.item.key,
                        focus: false
                    }"
                    :isMultiple="Boolean(props.item.is_plural)"
                    :isReadOnly="Boolean(props.item.read_only || (!props.row.isEdit && !props.isPermanentEdit))"
                    @openDatepicker="() => $emit('clickRow', true)"
                    @changeValue="(data) => changeValue(props.rowId, data)"
                />
                <AppMap 
                    v-else-if="props.item.type == 'address'"
                    :item="{
                        id: props.row.id,
                        title: props.item.title,
                        key: props.item.key,
                        required: Boolean(props.item.required),
                        focus: props.item.focus,
                        value: props.row[props.item.key],
                        options: [],
                        lockedOptions: []
                    }"
                    :isReadOnly="Boolean(props.item.read_only || (!props.row.isEdit && !props.isPermanentEdit))"
                    :isShowMap="false"
                    :isCanSelect="false"
                    :isShowLabel="false"
                    @changeValue="(data) => changeValue(props.rowId, data)"
                />

                <div class="table-item__icon" v-else-if="props.item.type == 'iconDrag'">
                    <IconDrag 
                        :draggable="true"
                        @dragover.prevent
                        @dragenter.prevent
                        @dragstart="(event) => $emit('dragRowStart', event)"
                        @dragend="(event) => $emit('dragRowEnd', event)"
                    />
                    <FormValue 
                        v-show="isNumeric"
                        :isHTML="false"
                        :value="props.rowId"
                        :isLink="false"
                        :link="null"
                    />
                </div>

                <IconDelete
                    v-else-if="props.item.type == 'iconDelete'"
                    @click="() => callAction({action: 'removeRow', value: props.rowId})"
                />
        </div>
    </td>
</template>

<script setup>
    import './Item.scss';
    import { inject, ref, computed } from 'vue'
    
    import AppDate from '@/components/AppInputs/Date/Date.vue'
    import IconDrag from '@/components/AppIcons/Drag/Drag.vue'
    import IconDelete from '@/components/AppIcons/Delete/Delete.vue'    
    import AppActions from '../Actions/Actions.vue'
    import AppFile from '@/components/AppInputs/File/File.vue'
    import AppStatus from '@/components/AppSelects/Status/Status.vue'
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import FormValue from '@/components/AppForm/FormValue/FormValue.vue'
    import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue"
    import AppTextarea from "@/components/AppInputs/Textarea/Textarea.vue"
    import AppRelation from "@/components/AppSelects/Relation/Relation.vue"
    import AppMap from '@/components/AppInputs/Map/Map.vue';
    import ButtonPayment from '@/components/AppButton/ButtonPayment/ButtonPayment.vue';
    import CommonScripts from '@/commonScripts/commonScripts.js'
    import storeTable from '@/stores/tableScripts/Table';

    const itemRef = ref(null)
    const bodyData = inject('bodyData')
    const isNumeric = inject('isNumeric')
    const isDinamyc = inject('isDinamyc')
    const actionState = inject('actionState')
    const backupValues = inject('backupValues')
    const skipChecking = inject('skipChecking')
    const backupRows = inject('backupRows')
    const is_admin = inject('is_admin')
    const userID = inject('userID')

    let clickSetting = ref({
        id: -1,
        delay: 500,
        clicks: 0,
        timer: null
    })

    const props = defineProps({
        item: {
            default: {
                id: 2249,
                title: "Файл",
                key: "fail_2249",
                width: "325px",
                enabled: true,
                type: "file",
                is_plural: 0,
                external_link: 1,
                is_external_link: 0,
                is_link: 0,
                required: 0,
                fixed: false,
                index: 7,
                fixTarget: "0px",
                read_only: 0,
                unit: "",
                mask: "",
                can_edit: 0,
                color: "#000",
                is_hidden: 0,
                visible_always: 1,
                options: []
            },
            type: Object
        },
        isCanOpenCount: {
            default: 0,
            type: Number
        },
        row: {},
        isTrash: {
            default: false,
            type: Boolean
        },
        isPermanentEdit: {
            default: false,
            type: Boolean
        },
        slug: {
            default: '',
            type: String
        },
        actionType: {
            default: 'view',
            type: String
        },
        rowId: {
            default: 0,
            type: Number
        },
        permissions: {
            default: {},
            type: Object
        }
    })

    const emit = defineEmits([
        'callAction',
        'changeValue'
    ])

    // Изменение значения в поле
    const changeValue = (id, data) => {
        let findedRow = bodyData.value[id - 1]

        emit("changeValue", {
			value: { ...data, id },
		});

        if (props.isPermanentEdit) {
            skipChecking.value = true
            
            if (actionState.value == null) {
                backupRows.value =  JSON.parse(JSON.stringify(bodyData.value))
                actionState.value = props.isTrash ? 'restoring' : 'saving'
                emit('callAction', {
                    action: "changeStateTab",
                    value: false
                })
            }
        }

        findedRow[data.key] = data.value

        if (data.key == 'isChoose') {
            if (data.value) {
                actionState.value = props.isTrash ? 'restoring' : 'editting'
            } else if (bodyData.value.filter(p => p.isChoose).length == 0) {
                actionState.value = null
            }
        } 

        if (isDinamyc && data.key == 'product_id') {
            for (let key in data.value.selectedOption) {
                if (['price', 'weight'].includes(key)) {
                    findedRow[`product_${key}`] = data.value.selectedOption[key]
                } else if (key == 'text') {
                    findedRow.product_name = data.value.selectedOption.text
                } else {
                    findedRow[key] = data.value.selectedOption[key]
                }
            }
            findedRow.product_count = 1,
            findedRow.localOptions = data.value.selectedOption ? [{
                label: data.value.selectedOption,
                value:  data.value.selectedOption.id
            }] : []
        }
    }

    const calcSum = computed(() => {
        return (props.row.product_count * props.row.product_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    })

    // Симуляция двойного клика
    const doubleClick = (event) => {
        let regexp = /<\/?[a-z][\s\S]*>/i

        document.querySelector('.table__item_clicked')?.classList.remove('table__item_clicked')

        if (itemRef.value.closest('.table__item').classList.contains('table__item_clicked')) {
            itemRef.value.closest('.table__item').classList.remove('table__item_clicked')
        } else {
            itemRef.value.closest('.table__item').classList.add('table__item_clicked')
        }

        if ((props.item.id > props.isCanOpenCount && !regexp.test(event.target.innerHTML)) || (props.isCanOpenCount == 0 && !regexp.test(event.target.innerHTML))) return 

        clickSetting.value.clicks++;
        if (clickSetting.value.clicks === 1) {
            clickSetting.value.timer = setTimeout( () => {
            clickSetting.value.clicks = 0
            }, clickSetting.value.delay);
        } else {
            let regexp = /<\/?[a-z][\s\S]*>/i
            if (!props.row.isEdit && actionState.value != 'saving' && event.target.closest('.popup_actions') == null && regexp.test(event.target.innerHTML)) {
                CommonScripts.clearSelection()
                callAction({action: 'showModal', value: null})
            }
            window.getSelection().empty();
            clearTimeout(clickSetting.value.timer);
            clickSetting.value.clicks = 0;
        }
        clickSetting.value.id = props.item.id
    }

    // Вызов действия в ячейке
    const callAction = (data) => {
        // Открытие ссылок
        const openLink = (value) => {
            emit('callAction', {
                action: 'showModal',
                value: {
                    id: value.id,
                    slug: value.slug,
                    tab: [null, undefined].includes(value.tab) ? null : value.tab
                }
            })
        }
       
        // Редактирование строки
        const editRow = (value) => {
            let findedIndex = bodyData.value.findIndex(row => row.id == value.id)

            backupValues.value.push(JSON.parse(JSON.stringify(bodyData.value[findedIndex])))
            bodyData.value[findedIndex].isEdit = true
            bodyData.value[findedIndex].isChoose = true
            actionState.value = 'saving'
        }

        // Редактирование строки
        const untieRow = (value) => {
            let findedIndex = bodyData.value.findIndex(row => row.id == value.id)
            backupValues.value.push(JSON.parse(JSON.stringify(bodyData.value[findedIndex])))
            bodyData.value[findedIndex].isChoose = true
            emit('callAction', {
                action: 'untie',
                value: true
            })
        }

        const authPortal = () => {
            storeTable.authPortal(typeof props.row.name == 'object' ? props.row.name.value : props.row.name)
        }

        switch (data.action) {
            // Открытие модального окна
            case 'showModal':
                openLink({
                    id: props.row.id,
                    slug: props.slug,
                    tab: null
                })
                break;

            // Редактирование строки
            case 'edit':
                editRow(data.value)
                break;

            // Открытие ссылки
            case 'openLink':
                openLink(data.value)
                break;

            // Отвязка строки
            case 'untieRow':
                untieRow(data.value)
                break;

            case 'authPortal': 
                authPortal()
                break;

            default:
                emit('callAction', {action: data.action, value: data.value})
                break;
        }
    }
</script>
