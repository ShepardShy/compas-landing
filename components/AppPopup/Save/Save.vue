<template>
    <AppPopup class="popup_save" ref="popupSavesRef" :isCanSelect="false" :closeByClick="false" @clickOutside="() => changeSaveTab(null)">
        <template #summary>
            <IconSave />
        </template>
        <template #content>
            <template v-if="menu.saves.activeTab != null && menu.saves.activeTab.tab == 'roles'">
                <PopupOption class="popup-option__sublink popup-option__sublink_back" @click="() => changeSaveTab(null)">
                    {{ menu.saves.activeTab.title }}
                    
                    <IconArrow />
                </PopupOption>
                <PopupOption v-for="option in menu.saves.options" @click="() => changeSaveTab(option)">
                    {{ option.label }}
                </PopupOption>
            </template>
            <template v-else>
                <PopupOption :class="option.tab == 'roles' ? 'popup-option__sublink': ''" v-for="option in menu.saves.tabs" @click="() => changeSaveTab(option)">
                    {{ option.title }}
                    <IconArrow v-show="option.tab == 'roles'"/>
                </PopupOption>
            </template>
        </template>
    </AppPopup>
</template>

<script setup>
    import './Save.scss';

    import { ref } from 'vue'

    import IconSave from '@/components/AppIcons/Save/Save.vue'
    import IconArrow from '@/components/AppIcons/Arrow/Arrow.vue'

    import AppPopup from '@/components/AppPopup/Popup.vue';
    import PopupOption from '@/components/AppPopup/PopupOption/PopupOption.vue';

    import { useUserStore } from '@/stores/userStore.js'
    const userStore = useUserStore()

    const popupSavesRef = ref(null)

    let menu = ref({
        saves: {
            isShow: false,
            activeTab: null,
            tabs: [
                {
                    tab: 'myself',
                    key: 'myself',
                    title: 'Применить для себя',
                },
                {
                    tab: 'roles',
                    key: 'roles',
                    title: 'Применить для роли',
                },
                {
                    tab: 'all',
                    key: 'all',
                    title: 'Применить для всех',
                }
            ],
            options: [],
        },
        activeTab: null
    })

    const emit = defineEmits([
        'saveSettings'
    ])

    // Изменение активной вкладки у сохранения
    const changeSaveTab = (tab) => {
        setTimeout(() => {
            menu.value.saves.activeTab = tab

            if (tab != null && tab.key != 'roles') {
                emit('saveSettings', tab.key ?? tab.id)
                popupSavesRef.value.popupRef.removeAttribute('open')
            }
        }, 10);
    }

    onMounted(() => {
        menu.value.saves.options = userStore.roles
    })

    watch(() => userStore.roles, () => {
        menu.value.saves.options = userStore.roles
    }, {
        deep: true
    })
</script>
