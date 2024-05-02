<template>
    <div class="modal" ref="modalRef">
        <div class="modal__list">
            <div 
                class="modal-item modal__item" 
                v-for="(item, index) in userStore.modals" 
                :style="`--modalOrder: ${50 * (index >= 3 ? 2 : index)}px; --index: ${index}`"
            >
                <div class="modal__background"></div>
                <div class="modal__close" :style="`--backgroundColor: ${item.color}`" @click="() => deletePage()">
                    <IconClose />
                    <span class="modal__close-text">
                        {{ item.title }} {{ item.loaderState }}
                    </span>
                </div>
                <div class="modal__content">
                    <ModuleStoreDetails 
                        v-if="item.template == 'module'"
                        :id="item.id"
                        :slug="item.slug"
                        @closeModal="() => userStore.modals.pop()"
                    />
                    <TableDetailsPage 
                        v-else
                        :id="item.id"
                        :slug="item.slug"
                        :isCreate="item.isCreate"
                        @savePage="() => item.isCreate = false"
                        @closeModal="() => userStore.modals.pop()"
                        @showModal="(data) => $emit('showModal', data)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import './Modal.scss';
    
    import { onMounted, onUnmounted, inject, watch, toRaw, ref } from 'vue'; 

    import IconClose from '@/components/AppIcons/Close/Close.vue'
    import tableScripts from '@/stores/tableScripts/Table.js'
    import TableDetailsPage from '@/components/Templates/TableDetailsPage/TableDetailsPage.vue'
    import ModuleStoreDetails from '@/components/Templates/ModuleStoreDetails/ModuleStoreDetails.vue'
    import commonScripts from '@/commonScripts/commonScripts';

    import {useUserStore} from '@/stores/userStore'
    const userStore = useUserStore()

    const parentPage = toRaw(window.location.href)
    
    const router = useRouter();
    const modalRef = ref()
    let preventClick = ref(null)
    let mouseEventDown = ref(null)
    let parentScroll = ref(0)

    onMounted(() => {
        openModal()
        parentScroll.value = window.scrollY
        document.body.classList.add('body_uncscroll')
        modalRef.value.addEventListener('mousedown', mouseDown)
        modalRef.value.addEventListener('mouseup', closeModal)
    })

    onUnmounted(() => {
        document.body.classList.remove('body_uncscroll')
        window.history.pushState("", "Title", parentPage);

        setTimeout(() => {
            window.scrollBy(0, parentScroll.value)
        }, 1);
    })

    // Открытие нового модального окна
    const openModal = () => {
        if (userStore.modals.length >= 11 || window.innerWidth <= 660) {
            router.push({ path: userStore.modals[userStore.modals.length - 1].link });
            window.location.replace(userStore.modals[userStore.modals.length - 1].link)
            window.history.pushState("", "Title", userStore.modals[userStore.modals.length - 1].link);
        } else {
            window.history.pushState("", "Title", userStore.modals[userStore.modals.length - 1].link);

            preventClick.value = true

            setTimeout(() => {
                preventClick.value = false
                commonScripts.clearSelection()
            }, 1000);
        }
    }

    // Закрытие модального окна
    const closeModal = (event) => {
        if (userStore.modals && userStore.modals.length > 0) {
            if ([userStore.modals.length - 1].loaderState == 'actionLoad') {
                return
            }
        }

        if (event.target.classList.contains('modal__background') && !preventClick.value && mouseEventDown.value.classList.contains('modal__background')) {
            deletePage()
        }
    }

    const deletePage = () => {
        let activeModal = userStore.modals[userStore.modals.length - 1]
            
        if (activeModal.isCreate) {
            tableScripts.deleteRows([activeModal.id], activeModal.slug)
        }
        userStore.modals.pop()
    }

    // Опускание мыши
    const mouseDown = (event) => {
        mouseEventDown.value = event.target
    }

    watch(() => userStore.modals, () => {
        openModal()
    }, {deep: true})
</script>
