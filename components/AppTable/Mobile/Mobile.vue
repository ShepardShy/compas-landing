<template>
    <div class="table-template__body_mobile">
        <AppLoader class="table-template__loader" ref="loaderRef"/>
            <draggable 
                tag="div"
                class="table-mobile"
                itemKey="table-mobile"
                :class="bodyData.length == 0 ? 'table-mobile_empty' : '', props.isPermanentEdit ? 'table-mobile_permanent-edit' : ''"
                v-model="bodyData" 
                handle=".icon__draggable"
                @start="() => dragStart()"
                @end="(event) => emit('callAction', {action: 'moveRows', value: event.to.__draggable_component__.modelValue})" 
            >
                <template #item="{ element: row, index }">
                    <div 
                        v-show="props.loaderState != 'loading'"
                        class="table-mobile__row table__row" 
                        :class="
                            row.isEdit ? 'table__row_edit' : row.isChoose ? 'table__row_choosed' : '', 
                            row.isUpdated ? 'table__row_updated' : '',
                            props.isCanOpenCount != 0 && row.id > props.isCanOpenCount ? 'table__row_disabled' : ''
                        "
                    >
                        <div 
                            v-for="item in fields" 
                            class="table-mobile__field table__item" 
                            :class="[
                                !item.enabled ? 'table__item_hidden' : '',
                                !['checkbox', 'payment', 'actions', 'iconDrag', 'iconDelete'].includes(item.type) && (!item.visible_always && isEmpty(item.type == 'relation' ? row[item.key]?.value : row[item.key] != null ? String(row[item.key]) : row[item.key])) ? 'table__item_unvisible' : ''
                                ]"
                            :style="`--colorItem: ${item.color}`"
                            @click="(event) => doubleClick(event, row, item)" 
                        >
                            <AppCheckbox 
                                v-if="item.type == 'checkbox'"
                                :item="{
                                    isHTML: false,
                                    id: row.id,
                                    key: item.key,
                                    title: item.title,
                                    value: row[item.key],
                                    required: Boolean(item.required)
                                }"
                                :disabled="actionState == 'saving'"
                                @changeValue="(data) => changeValue(row.id, data)"
                            />
                            <ButtonPayment 
                                v-else-if="item.type == 'payment'"
                                :item="{
                                    id: row.id,
                                    key: item.key,
                                    title: item.title,
                                    value: row[item.key] ? row[item.key]?.value : null,
                                    state: row[item.key] ? row[item.key].state : null,
                                    isCanClick: item.can_edit
                                }"
                                @initPayment="(data) => emit('callAction', {action: 'initPayment', value: {
                                    id: row.id,
                                    value: data.value
                                }})"
                            />
                            <AppRelation 
                                v-else-if="item.type == 'relation'"
                                :item="{
                                    focus: false,
                                    id: row.id,
                                    placeholder: null,
                                    key: item.key,
                                    title: item.title,
                                    value: row[item.key],
                                    required: Boolean(item.required),
                                    anotherKey: isDinamyc ? 'product_name' : null,
                                    anotherTitle: isDinamyc ? row.product_name : null,
                                    options: ['status', 'relation'].includes(item.type) ? item.options : null,
                                    lockedOptions: item.choosed,
                                }"
                                :isCanCreate="Boolean(item.can_create)"
                                :isAnotherTitle="isDinamyc"
                                :isMultiple="Boolean(item.is_plural)"
                                :isCanEdit="Boolean(item.can_edit)"
                                :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                                @changeValue="(data) => changeValue(row.id, data)"
                                @openLink="(data) => callAction({action: 'openLink', value: {id: data.id, slug: item.related_table}})"
                                @showAll="() => callAction({action: 'openLink', value: {id: row.id, slug: props.slug, tab: item.related_table}})"
                                @createOption="() => emit('callAction', {action: 'createOption', value: item.related_table})"
                            />
                            <AppTextarea 
                                v-else-if="['number', 'password', 'text'].includes(item.type) && (!isDinamyc || (isDinamyc && item.key != 'product_sum'))"
                                :item="{
                                    focus: false,
                                    id: row.id,
                                    placeholder: null,
                                    key: item.key,
                                    type: item.type,
                                    title: item.title,
                                    substring: item.unit,
                                    required: Boolean(item.required),
                                    external_link: ![null, undefined].includes(row[item.key]) && row[item.key] != '' ? row[item.key].external_link : null,
                                    value: [null, undefined].includes(row[item.key]) ? null : typeof row[item.key] == 'object' ? String(row[item.key]?.value) : String(row[item.key]),
                                }"
                                :disabled="false"
                                :isUseEnter="false"
                                :mask="item.mask"
                                :isLink="Boolean(item.is_external_link)"
                                :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                                @changeValue="(data) => changeValue(row.id, data)"
                            />
                            <FormItem 
                                v-else-if="item.type == 'json'"
                                class="form-item__value" 
                                :required="Boolean(item.required)"
                            >
                                <FormLabel
                                    v-show="item.title != null && item.title != ''"
                                    :title="item.title"
                                />

                                <FormValue 
                                    :isHTML="true"
                                    :value="row[item.key]"
                                    :isLink="Boolean(item.is_external_link)"
                                    :link="typeof row[item.key] == 'object' && row[item.key] != null ? row[item.key].external_link : null"
                                />
                            </FormItem>
                            <FormValue 
                                v-else-if="isDinamyc && item.key == 'product_sum'"
                                :isHTML="true"
                                :value="calcSum(row)"
                                :isLink="Boolean(item.is_external_link)"
                                :link="typeof row[item.key] == 'object' && row[item.key] != null ? row[item.key].external_link : null"
                            />
                            <AppActions 
                                v-else-if="item.type == 'actions'"
                                :item="{
                                    title: 'Действие',
                                    slug: row.isEdit ? 'edit' : props.actionType
                                }"
                                :disabled="!row.isChoose && actionState == 'saving'"
                                :permissions="props.permissions"
                                :userID="userID"
                                :is_admin="is_admin"
                                :relationID="row.user_id?.value"
                                @callAction="(data) => callAction({action: data.value, value: row})"
                            />
                            <AppStatus 
                                v-else-if="item.type == 'status'"
                                :item="{
                                    focus: false,
                                    id: row.id,
                                    key: item.key,
                                    title: item.title,
                                    options: item.options,
                                    value: row[item.key],
                                    required: Boolean(item.required),
                                }"
                                :isCanCreate="false"
                                :isHaveNullOption="false"
                                :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                                @changeValue="(data) => changeValue(row.id, data)"
                            />
                            <AppSelect 
                                v-else-if="item.type == 'select_dropdown'"
                                :item="{
                                    id: row.id,
                                    key: item.key,
                                    value: row[item.key],
                                    focus: false,
                                    required: Boolean(item.required),
                                    title: item.title,
                                    options: item.options,
                                    lockedOptions: []
                                }"
                                :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                                :isHaveNullOption="true"
                                :isMultiple="Boolean(item.is_plural)"
                                :isFiltered="true"
                                @changeValue="(data) => changeValue(row.id, data)"
                            />
                            <AppFile 
                                v-else-if="item.type == 'file'"
                                :item="{
                                    id: row.id,
                                    title: item.title,
                                    key: item.key,
                                    required: Boolean(item.required),
                                    buttonName: null,
                                    value: row[item.key]
                                }"
                                :isReadOnly="true"
                                :isShowFileName="false"
                                :isMultiple="false"
                                :isOneFile="true"
                                @changeValue="(data) => changeValue(row.id, data)"
                            />
                            <AppDate 
                                v-else-if="item.type == 'date'"
                                :item="{
                                    id: row.id,
                                    required: true,
                                    title: item.title,
                                    placeholder: null,
                                    value: row[item.key],
                                    key: item.key,
                                    focus: false
                                }"
                                :isMultiple="Boolean(item.is_plural)"
                                :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                                @changeValue="(data) => changeValue(row.id, data)"
                            />

                            <AppMap 
                                v-else-if="item.type == 'address'"
                                :item="{
                                    id: row.id,
                                    title: item.title,
                                    key: item.key,
                                    required: Boolean(item.required),
                                    focus: item.focus,
                                    value: row[item.key],
                                    options: [],
                                    lockedOptions: []
                                }"
                                :isReadOnly="Boolean(item.read_only || !row.isEdit)"
                                :isShowMap="false"
                                :isCanSelect="false"
                                :isShowLabel="false"
                                @changeValue="(data) => changeValue(row.id, data)"
                            />

                            <div class="table-item__icon" v-else-if="item.type == 'iconDrag'">
                                <IconDrag />
                                <FormValue 
                                    v-show="isNumeric"
                                    :isHTML="false"
                                    :value="index + 1"
                                    :isLink="false"
                                    :link="null"
                                />
                            </div>

                            <IconDelete
                                v-else-if="item.type == 'iconDelete'"
                                @click="() => callAction({action: 'removeRow', value: index + 1})"
                            />
                            <div v-else>
                                {{ item.type }}
                            </div>
                        </div>
                    </div>
                </template>
        </draggable>
    </div>
</template>

<script setup>
    import './Mobile.scss';

    import draggable from 'vuedraggable'
    import { inject, ref, onMounted, onUnmounted } from 'vue'
    
    import AppMap from '@/components/AppInputs/Map/Map.vue';
    import AppDate from '@/components/AppInputs/Date/Date.vue'
    import AppFile from '@/components/AppInputs/File/File.vue'
    import AppLoader from '@/components/AppLoader/AppLoader.vue';
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';
    import AppActions from '@/components/AppTable/Body/Actions/Actions.vue'
    import AppStatus from '@/components/AppSelects/Status/Status.vue'
    import AppSelect from '@/components/AppSelects/Select/Select.vue'
    import FormValue from '@/components/AppForm/FormValue/FormValue.vue'
    import AppCheckbox from "@/components/AppInputs/Checkbox/Checkbox.vue"
    import AppTextarea from "@/components/AppInputs/Textarea/Textarea.vue"
    import AppRelation from "@/components/AppSelects/Relation/Relation.vue"
    import IconDrag from '@/components/AppIcons/Drag/Drag.vue'
    import IconDelete from '@/components/AppIcons/Delete/Delete.vue'    
    import ButtonPayment from '@/components/AppButton/ButtonPayment/ButtonPayment.vue';
    import isEmpty from 'lodash/isEmpty'

    const fields = inject('fields')
    const bodyData = inject('bodyData')
    const backupRows = inject('backupRows')
    const sectionRef = inject('sectionRef')
    const actionState = inject('actionState')
    const backupValues = inject('backupValues')
    const scrollPosition = inject('scrollPosition')
    const skipChecking = inject('skipChecking')
    const isNumeric = inject('isNumeric')
    const isDinamyc = inject('isDinamyc')
    const is_admin = inject('is_admin')
    const userID = inject('userID')

    let clickSetting = ref({
        id: -1,
        delay: 500,
        clicks: 0,
        timer: null
    })

    const props = defineProps({
        slug: {
            default: null,
            type: String
        },
        isTrash: {
            default: false,
            type: Boolean
        },
        loaderState: {
            default: null
        },
        isPermanentEdit: {
            default: false,
            type: Boolean
        },
        actionType: {
            default: 'view',
            type: String
        },
        permissions: {
            default: {},
            type: Object
        },
        isCanOpenCount: {
            default: 0,
            type: Number
        }
    })

    const emit = defineEmits([
        'callAction','changeValue'
    ])

    // Изменение значения в поле
    const changeValue = (id, data) => {
        emit('changeValue', {value:{...data,id}})
        
        let findedRow = bodyData.value.find(row => row.id == id)
        findedRow[data.key] = data.value

        if (data.key == 'isChoose') {
            if (data.value) {
                actionState.value = props.isTrash ? 'restoring' : 'editting'
            } else if (bodyData.value.filter(p => p.isChoose).length == 0) {
                actionState.value = null
            }
        }

        if (props.isPermanentEdit) {
            skipChecking.value = true

            if (actionState.value == null) {
                backupRows.value =  JSON.parse(JSON.stringify(bodyData.value))
                actionState.value = props.isTrash ? 'restoring' : 'saving'
            }

            backupValues.value = JSON.parse(JSON.stringify(bodyData.value))
        }

        if (isDinamyc && data.key == 'product_id') {
            findedRow.id = data.value.selectedOption ? data.value.selectedOption.id : null
            findedRow.product_price = data.value.selectedOption ? data.value.selectedOption.price : null
            findedRow.product_weight = data.value.selectedOption ? data.value.selectedOption.weight : null
            findedRow.product_count = 1

            if (data.value.value != null) {
                findedRow[data.key].localOptions = [{
                    label: data.value.selectedOption,
                    value:  data.value.selectedOption.id
                }]
            }
        }
    }

    // Симуляция двойного клика
    const doubleClick = (event, row, item) => {
        let regexp = /<\/?[a-z][\s\S]*>/i
        if (!regexp.test(event.target.innerHTML)) return

        clickSetting.value.clicks++;
        if (clickSetting.value.clicks === 1) {
            clickSetting.value.timer = setTimeout( () => {
            clickSetting.value.clicks = 0
            }, clickSetting.value.delay);
        } else {
            let regexp = /<\/?[a-z][\s\S]*>/i
            if (!row.isEdit && actionState.value != 'saving' && event.target.closest('.popup_actions') == null && regexp.test(event.target.innerHTML)) {
                callAction({action: 'showModal', value: row.id})
            }
            window.getSelection().empty();
            clearTimeout(clickSetting.value.timer);
            clickSetting.value.clicks = 0;
        }
        clickSetting.value.id = item.id
    }

    // Вызов действия в ячейке
    const callAction = (data) => {
        console.log(data);

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

        switch (data.action) {
            // Открытие модального окна
            case 'showModal':
                openLink({
                    id: data.value.id ?? data.value,
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

            default:
                emit('callAction', {action: data.action, value: data.value})
                break;
        }
    }

    // Установка позиции у кнопок
    const setPosition = () => {
        // старт таблицы
        if (sectionRef.value.sectionRef.getBoundingClientRect().top > 0) {
            const rect = sectionRef.value.sectionRef.getBoundingClientRect();
            const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            if (isFullyVisible) {
                return (sectionRef.value.sectionRef.offsetHeight - 82) / 2 - 27
            } else {
                return (window.innerHeight - sectionRef.value.sectionRef.getBoundingClientRect().top - 82) / 2 - 17
            }
        // конец таблицы
        } else {
            let startPosScrollBlock = sectionRef.value.sectionRef.getBoundingClientRect().top +  window.pageYOffset - document.body.clientTop
            if (sectionRef.value.sectionRef.getBoundingClientRect().height + startPosScrollBlock < window.scrollY + window.innerHeight) {
                return window.innerHeight / 2 + (window.scrollY - startPosScrollBlock - startPosScrollBlock + 5)
            }
            // середина таблицы
            else {
                return window.innerHeight / 2 + window.scrollY - startPosScrollBlock - 41
            }
        }
    }

    const dragStart = () => {
        if (actionState.value != 'saving') {
            backupRows.value = JSON.parse(JSON.stringify(bodyData.value))
        }
    }

    const calcSum = (row) => {
        return (row.product_count * row.product_price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }

    onMounted(async () => {
        window.addEventListener('scroll', throt_funScroll)

        setTimeout(() => {
            scrollPosition.value = setPosition()
        }, 100);
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', throt_funScroll)
    })

    // Троттлинг скролла по вертикали
    const throt_funScroll = () => {
        scrollPosition.value = setPosition()
    }
</script>
