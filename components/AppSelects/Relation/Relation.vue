<template>
    <FormItem
        class="form-item__relation relation" 
        :required="props.item.required"
        :class="values.filter(p => p != null).length == 0 ? 'relation_empty' : ''"
    >
        <FormLabel
            v-show="props.item.title != null && props.item.title != ''"
            :title="props.item.title"
        />    

        <div class="relation__list">
            <RelationItem 
                v-for="(value, index) in values"
                :class="(values.length > 5 && index < values.length - 5) ? 'relation__item_hidden' : ''"
                :item="{
                    id: index,
                    value: value,
                    placeholder: null,
                    focus: false,
                    key: props.item.key,
                    anotherKey: props.item.anotherKey,
                    options: localOptions,
                    lockedOptions: lockedOptions,
                    anotherTitle: props.item.anotherTitle,
                    related_table: props.item.related_table
                }"
                :fieldId="props.item.id"
                :isReadOnly="props.isReadOnly"
                :isHaveLink="props.isHaveLink"
                :isCanCreate="props.isCanCreate"
                :isAnotherTitle="props.isAnotherTitle"
                @openLink="(item) => props.isHaveLink ? emit('openLink', item) : null"
                @callAction="(data) => callAction(data, index)"
                @clickOutside="() => emit('clickOutside', true)"
                @createOption="(data) => emit('createOption', data)"
            />
        </div>

        <div class="relation__actions">
            <ButtonText  v-show="values.length >= 5" @click="() => callAction({action: 'showAll', value: true})"> 
                Всего <span class="relation__actions-all">{{ values.length }}</span>, посмотреть все 
            </ButtonText>
            <ButtonText v-if="props.isCanEdit && props.isMultiple" @click="() => callAction({action: 'changeValue', value: {value: null, isNew: true}})"> 
                + Добавить 
            </ButtonText>
        </div>
    </FormItem>
</template>

<script setup>
    import './Relation.scss';
    
    import { ref, onMounted, watch } from 'vue'

    import _ from 'lodash'

    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';
    import RelationItem from './RelationItem/RelationItem.vue'
    import ButtonText from '@/components/AppButton/ButtonText/ButtonText.vue';

    let values = ref([])
    let lockedOptions = ref([])
    let localOptions = ref([])
    let prevValue = ref(null)

    const props = defineProps({
        item: {
            default: {
                title: null,
                id: 0,
                required: false,
                value: {
                    value: null,
                    localOptions: []
                },
                placeholder: null,
                focus: false,
                key: null,
                options: [],
                lockedOptions: [],
                anotherTitle: null
            },
            type: Object
        },
        isReadOnly: {
            default: false,
            type: Boolean
        },
        isCanCreate: {
            default: true,
            type: Boolean
        },
        isMultiple: {
            default: true,
            type: Boolean
        },
        isAnotherTitle: {
            default: false,
            type: Boolean
        },
        loaderStatus: {
            default: false,
            type: Boolean
        },
        isHaveLink: {
            default: true,
            type: Boolean
        },
        isCanEdit: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'showAll',
        'openLink',
        'changeValue',
        'createOption',
        'clickOutside'
    ])

    // Вызов действия
    const callAction = (data, index) => {
        
        // Изменение значения
        const changeValue = (value) => {
            if (props.loaderStatus === 'save') return
            prevValue.value = toRaw(values.value[index])

            if (data.value.isNew) {
                values.value.push(null)
            } else {
                values.value[index] = value.value ?? null

                if (value.id != null) {
                    localOptions.value.push(value)
                }

                localOptions.value = _.uniqBy(localOptions.value, (o) => {
                    return o.value;
                }).filter(p => values.value.includes(p.value))

                callAction({action: 'getOptions', value: true})
            }

            lockedOptions.value = Array.from(new Set(props.item.lockedOptions)).concat(values.value).filter(p => p != prevValue.value)
            emit('changeValue', {
                key: props.item.key,
                value: {
                    value: values.value,
                    localOptions: localOptions.value,
                    selectedOption: value.label,
                    lockedOptions: lockedOptions.value
                }
            })
        }

        // Показать все опции
        const showAll = () => {
            emit('showAll', {
                key: props.item.key,
                value: true
            })
        }

        // Получить значения от родителя
        const getValues = () => {
            if ([null, undefined].includes(props.item.value) || !Array.isArray(props.item.value.value) || props.item.value.value.length == 0) {
                values.value =  [null] 
            } else {
                let localValues = props.item.value.value
                
                if (localValues.length == 0) {
                    localValues =  [null]
                }

                values.value = JSON.parse(JSON.stringify(localValues))
            }
            lockedOptions.value = Array.from(new Set(props.item.lockedOptions)).concat(values.value.filter(item => item != null)).filter(p => p != prevValue.value)
        }

        // Получение опций
        const getOptions = () => {
            let filteredLocalOptions = props.item.value != null && props.item.value.localOptions != null ? props.item.value.localOptions.filter(p => ![null, undefined].includes(p) && typeof p == 'object') : []
            let options = JSON.parse(JSON.stringify(props.item.options.concat(filteredLocalOptions)))

            localOptions.value = _.uniqBy(options.filter(p => p != null), (o) => {
                return o.value;
            })
        }

        const changeAnotherTitle = () => {
            emit('changeValue', data.value)
        }

        switch (data.action) {
            // Изменение значения
            case "changeValue":
                changeValue(data.value)
                break;

            // Показать все опции
            case "showAll":
                showAll()
                break;

            // Получить значения от родителя
            case "getValues":
                getValues()
                break;

            // Получение опций
            case "getOptions":
                getOptions()
                break;

            // Изменить альтернативный заголовок
            case 'changeAnotherTitle':
                changeAnotherTitle();
                break;

            default:
                break;
        }
    }

    onMounted(() => {
        callAction({action: 'getValues', value: true})
        callAction({action: 'getOptions', value: true})
    })

    watch(() => props.item.value, () => {
        callAction({action: 'getValues', value: true})
    }, {
        deep: true
    })
</script>
