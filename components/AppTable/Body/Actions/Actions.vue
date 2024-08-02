<template>
    <FormItem 
        class="form-item__action" 
    >
        <FormLabel
            v-show="props.item.title != null && props.item.title != ''"
            :title="props.item.title"
        />

        <AppPopup 
            class="popup_actions" 
            ref="popupRef" 
            :isCanSelect="false"
            :closeByClick="false" 
            @click="(e) => props.disabled ? e.preventDefault() : openPopup(true)" 
            @clickOutside="() => openPopup(false)"
        >
            <template #summary>
                <IconDots />
            </template>
            <template #content>
                <template v-if="menu.activeTab == null">
                    <PopupOption 
                        class="popup-option__sublink" 
                        v-for="tab in setOptions" 
                        :class="tab.class"
                        @click="() => tab.children.length > 0 ? 
                            callAction({action: 'changeTab', value: tab}) : 
                            callAction({action: 'callAction', value: tab.action})"
                        >

                        {{ tab.title }} 

                        <IconArrow v-show="tab.children.length > 0" />
                    </PopupOption>
                </template>

                <template v-else>
                    <PopupOption 
                        class="popup-option__sublink popup-option__sublink_back" 
                        @click="() => callAction({action: 'changeTab', value: null})"
                    >
                        <IconArrow />
                        
                        {{ menu.activeTab.title }}
                    </PopupOption>

                    <PopupOption 
                        v-for="option in menu.activeTab.children" 
                        @click="() => callAction({action: 'callAction', value: option.action})"
                    >
                        {{ option.title }}
                    </PopupOption>
                </template>
            </template>
        </AppPopup>
    </FormItem>
</template>

<script setup>
    import './Actions.scss';

    import { ref } from 'vue';

    import IconDots from '@/components/AppIcons/Dots/Dots.vue'
    import IconArrow from '@/components/AppIcons/Arrow/Arrow.vue'

    import AppPopup from '@/components/AppPopup/Popup.vue';
    import FormItem from '@/components/AppForm/FormItem/FormItem.vue';
    import FormLabel from '@/components/AppForm/FormLabel/FormLabel.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    import actions from './actions.json'

    let menu = ref({
        activeTab: null
    })

    const popupRef = ref(null)

    const props = defineProps({
        item: {
            default: {
                title: 'Действие',
                slug: 'views',
            },
            type: Object
        },
        disabled: {
            default: false,
            type: Boolean
        },
        permissions: {
            default: {},
            type: Object
        },
        userID: {
            default: null,
            type: Number
        },
        is_admin: {
            default: null,
            type: Boolean
        },
        relationID: {
            default: null,
            type: Number
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    // Вызов действия
    const callAction = (data) => {
        if (data.action == 'changeTab') {
            setTimeout(() => {
                menu.value.activeTab = data.value
            }, 10);
        } else if (data.action == 'callAction') {
            popupRef.value.popupRef.removeAttribute('open')
            menu.value.activeTab = null
            emit('callAction', {
                action: data.action,
                value: data.value
            })
        }
    }

    const setOptions = computed(() => {
        let localOptions = actions[props.item.slug]

        if (props.is_admin) {
            return localOptions
        } else {
            // Создание
            if (props.permissions.create_p == 'Y') {
                localOptions = props.relationID == props.userID ? localOptions : localOptions.filter(p => p.action != 'copyRow')
            } else if (props.permissions.create_p == 'N') {
                localOptions = localOptions.filter(p => p.action != 'copyRow')
            }

            // Чтение
            if (props.permissions.read_p == 'Y') {
                localOptions = props.relationID == props.userID ? localOptions : localOptions.filter(p => p.action != 'showModal')
            } else if (props.permissions.read_p == 'N') {
                localOptions = localOptions.filter(p => p.action != 'showModal')
            }

            // Изменение
            if (props.permissions.update_p == 'Y') {
                localOptions = props.relationID == props.userID ? localOptions : localOptions.filter(p => p.action != 'edit')
            } else if (props.permissions.update_p == 'N') {
                localOptions = localOptions.filter(p => p.action != 'edit')
            }

            // Удаление
            if (props.permissions.delete_p == 'Y') {
                localOptions = props.relationID == props.userID ? localOptions : localOptions.filter(p => p.action != 'initDelete')
            } else if (props.permissions.delete_p == 'N') {
                localOptions = localOptions.filter(p => p.action != 'initDelete')
            }
            return localOptions
        }
    })

    // Открыть попап
    const openPopup = (state) => {
        if (state) {
            popupRef.value != null ? popupRef.value.popupRef.closest('.table__item').classList.add('table__item_clicked') : ''
        } else {
            menu.value.activeTab = null
            popupRef.value != null ? popupRef.value.popupRef.closest('.table__item').classList.remove('table__item_clicked') : ''
        }
    }
</script>
