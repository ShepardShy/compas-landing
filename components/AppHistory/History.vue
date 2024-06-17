<template>
    <div class="history">
        <div class="history__header">
            <div class="history__title">
                {{ props.title }}
            </div>
        </div>
        <div class="history__body">
            <div class="history__section history-section" v-for="group in history">
                <div 
                    class="history-section__title" 
                    :class="new Date().toLocaleDateString('fr-CA', {year:'numeric', month: '2-digit', day:'2-digit'}) == group.date ? 'history-section__title_active' : ''"
                >
                    {{ group.date.split('-').reverse().join('.') }}
                </div>
                <div class="history-section__list">
                    <div class="history-section__item" v-for="field in group.fields">
                        <IconEditWithCircle 
                            class='history-section__icon'
                        />

                        <div class="history-item"  v-if="field.show_title">
                            <div class="history-item__header">
                                <div class="history-item__group">
                                    <div class="history-item__date"> 
                                        {{ field.created_at }}
                                    </div>
                                </div>
                                <figure 
                                    :title="field.user.name"
                                    class='ibg history-item__user' 
                                    :style="`--backgroundColor: ${field.user.color};`"
                                    @click="() => emit('callAction', { action: 'showModal', value: {
                                            id: field.user.id,
                                            slug: 'users',
                                            tab: null
                                        }
                                    })"
                                >
                                    <img 
                                        v-if="![null, undefined].includes(field.user.icon) && field.user.icon != ''"
                                        :src="field.user.icon" 
                                        :alt="field.user.name" 
                                    />
                                    <figcaption v-else>
                                        {{ field.user.ab }}
                                    </figcaption>
                                </figure>
                            </div>
                            <div class="history-item__body">
                                <div class="history-item__title" @click="(event) => openModal(event)" :style="`--TitleColor: ${field.color}`" v-html="field.field.title"> </div>
                            </div>
                        </div>

                        <div class="history-item" v-else>
                            <div class="history-item__header">
                                <div class="history-item__group">
                                    <div class="history-item__title" :style="`--TitleColor: ${field.color}`">
                                        Изменение поля:
                                    </div>
                                    <div class="history-item__date"> 
                                        {{ field.created_at }}
                                    </div>
                                </div>
                                <figure 
                                    :title="field.user.name"
                                    class='ibg history-item__user' 
                                    :style="`--backgroundColor: ${field.user.color};`"
                                    @click="() => emit('callAction', { action: 'showModal', value: {
                                            id: field.user.id,
                                            slug: 'users',
                                            tab: null
                                        }
                                    })"
                                >
                                    <img 
                                        v-if="![null, undefined].includes(field.user.icon) && field.user.icon != ''"
                                        :src="field.user.icon" 
                                        :alt="field.user.name" 
                                    />
                                    <figcaption v-else>
                                        {{ field.user.ab }}
                                    </figcaption>
                                </figure>
                            </div>
                            <div class="history-item__body">
                                <div class="history-item__field">
                                    {{ field.field.title }}:
                                </div>
                                <div class="history-item__action">
                                    <div class="history-item__text" :class="setClasses(field.field.prev_value)" v-html="field.field.prev_value"> </div>
                                    <IconArrowWithBlueBackround 
                                        class='history-item__action-icon'
                                    />
                                    <div class="history-item__text" :class="setClasses(field.field.next_value)" v-html="field.field.next_value"> </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="history__footer" v-show="props.history.current_page < props.history.last_page">
            <AppButton class="button_white" :disabled="props.loaderState == 'loadHistory'" :class="props.loaderState == 'loadHistory' ? 'button_loading' : ''" @click="() => emit('callAction', {
                action: 'showMore',
                value: {
                    page: props.history.current_page + 1,
                    per_page: props.history.per_page
                }
            })">
                Показать еще {{ props.loaderState }}
            </AppButton>
        </div>
    </div>
</template>

<script setup>
    import './History.scss';
    
    import { onMounted, ref, watch } from 'vue'
    
    import AppButton from '@/components/AppButton/AppButton.vue';
    import IconArrowWithBlueBackround from '@/components/AppIcons/ArrowWithBlueBackround/ArrowWithBlueBackround.vue';
    import IconEditWithCircle from '@/components/AppIcons/EditWithCircle/EditWithCircle.vue';

    const props = defineProps({
        history: {
            default: {
                data: [],
                last_page: 1,
                per_page: 20,
                current_page: 1,
            },
            type: Object
        },
        loaderState: {
            default: null,
            type: String
        },
        isSlug: {
            default: false,
            type: Boolean
        },
        title: {
            default: null,
            type: String
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    let history = ref([])

    // Получение значений
    const getValue = (data) => {
        let findedIndex = null
        for (let field of data) {
            findedIndex = history.value.findIndex((historyField) => historyField.date == field.date)            
            if (findedIndex == -1) {
                history.value.push({
                    date: field.date,
                    fields: [field]
                })
            } else {
                if (history.value[findedIndex].fields.find(historyField => historyField.id == field.id) == undefined) {
                    history.value[findedIndex].fields.push(field)
                }
            }
        }

        // Сортировка полей по дате внутри группы
        const sortFields = () => {
            const getSeconds = (time) => {
                let a = time.split(':')
                let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                return seconds
            }

            history.value = history.value.sort((next, prev) => new Date(prev.date) - new Date(next.date))

            for (let group of history.value) {
                group.fields = group.fields.sort((next, prev) => getSeconds(prev.created_at) - getSeconds(next.created_at))
            }
        }

        sortFields()
    }

    const setClasses = (value) => {
        if ([null, undefined].includes(value) || value.trim() == '') {
            return 'history-item__text_empty'
        }
    }

    // Открыть модальное окно
    const openModal = (event) => {
        let targetLink = event.target.closest('span')

        if (targetLink) {
            emit('callAction', { action: 'showModal', value: {
                    id: targetLink.getAttribute('data-id'),
                    slug: targetLink.getAttribute('data-slug'),
                    tab: null
                }
            })
        }
    }

    onMounted(() => {
        getValue(props.history.data)
    })

    watch(() => props.history.data, () => {
        getValue(props.history.data)
    }, {
        deep: true
    })
</script>
