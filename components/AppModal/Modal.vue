<template>
    <div class="modal" ref="modalRef">
        <div class="modal__list">
            <div 
                class="modal-item modal__item" 
                v-for="(item, index) in modals" 
                :style="`--modalOrder: ${50 * (index >= 3 ? 2 : index)}px; --index: ${index}`"
            >
                <div class="modal__background"></div>
                <div class="modal__close" :style="`--backgroundColor: ${item.color}`" @click="() => modals.pop()">
                    <IconClose />
                    <span class="modal__close-text">
                        {{ item.title }}
                    </span>
                </div>
                <div class="modal__content">
                    Modal Content
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import './Modal.scss';
    
    import { onMounted, onUnmounted, inject, watch, toRaw, ref } from 'vue'; 

    import IconClose from '@/components/AppIcons/Close/Close.vue'
    import commonScripts from '@/commonScripts/commonScripts';

    const parentPage = toRaw(window.location.href)
    
    const modalRef = ref()
    let preventClick = ref(null)
    let mouseEventDown = ref(null)
    let parentScroll = ref(0)

    const modals = inject('modals')

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

    const savePage = (data, item) => {
        let lastModal = modals.find(p => p.id == item.id)
        lastModal.link = `/objects/${lastModal.slug}/${data.id}`
        lastModal.isCreate = false

        if (window.innerWidth <= 660) {
            window.location.replace(lastModal.link)
        }
    }

    // Открытие нового модального окна
    const openModal = () => {
        let lastModal = modals ? [modals.length - 1] : null

        if (lastModal) {
            if (modals.length >= 11 || window.innerWidth <= 660) {
                window.location.replace(lastModal.link)
                lastModal.isCreate ? window.history.pushState("", "Title", `/objects/${lastModal.slug}/0`) : window.history.pushState("", "Title", lastModal.link)
            } else {
                lastModal.isCreate ? window.history.pushState("", "Title", `/objects/${lastModal.slug}/0`) : window.history.pushState("", "Title", lastModal.link)
                preventClick.value = true
    
                setTimeout(() => {
                    preventClick.value = false
                    commonScripts.clearSelection()
                }, 1000);
            }
        }
    }

    // Закрытие модального окна
    const closeModal = (event) => {
        if (modals && modals.length > 0) {
            if ([modals.length - 1].loaderState == 'actionLoad') {
                return
            }
        }

        if (event.target.classList.contains('modal__background') && !preventClick.value && mouseEventDown.value.classList.contains('modal__background')) {
            modals.value ? modals.pop() : null
        }
    }

    // Опускание мыши
    const mouseDown = (event) => {
        mouseEventDown.value = event.target
    }

    watch(() => modals, () => {
        openModal()
    }, {deep: true})
</script>
