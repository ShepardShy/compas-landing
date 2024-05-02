<template>
    <div class="warning" v-if="props.isShow" ref="warningRef">
        <div 
            class="warning__background" 
            @mousedown="event => modalAction({action: 'mouseDown', event: event})" 
            @mouseup="event => modalAction({action: 'closeModal', event: event})"
        >
            <div class="warning__content">
                <IconDelete class="warning__close" @click="() => emit('closeModal', true)"/>

                <AppH3 class="warning__title">
                    <slot name="title"></slot>
                </AppH3>

                <div class="warning__body">
                    <slot name="body"></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import './AppWarning.scss';
    
    import { ref, watch, onMounted, onUnmounted} from 'vue'

    import AppH3 from '@/components/AppHeaders/H3/H3.vue';
    import IconDelete from '@/components/AppIcons/Delete/Delete.vue';

    const props = defineProps({
        isShow: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'closeModal'
    ])

    const modalRef = ref(null)
    const warningRef = ref(null)
    let mouseEventDown = ref(null)

    // Действия с модальным окном
    const modalAction = (data) => {
        // Закрытие модального окна
        const closeModal = (event) => {
            if (event.target.classList.contains('warning__background') && mouseEventDown.value.classList.contains('warning__background')) {
                emit('closeModal', false)
            }
        }

        switch (data.action) {
            //Определение где была нажата кнопка мыши
            case 'mouseDown':
                mouseEventDown.value = data.event.target
                break;

            // Закрытие модального окна
            case 'closeModal':
                closeModal(data.event)
        
            default:
                break;
        }
    }

    watch(() => props.isShow, () => {
        if (props.isShow) {
            document.body.parentNode.classList.add('body_uncscroll')
        } else {
            if (document.querySelector('.modal-container') == null) {
                document.body.parentNode.classList.remove('body_uncscroll')
            }
        }
    }, {
        deep: true
    })

    onMounted(() => {
        modalRef.value = document.querySelector('.modal')
        if (modalRef.value) {
            modalRef.value.classList.add('modal_warning')
        }
        document.body.parentNode.classList.add('body_uncscroll')
    })

    onUnmounted(() => {
        if (document.querySelector('.modal-container') == null) {
            document.body.parentNode.classList.remove('body_uncscroll')
        }

        if (modalRef.value) {
            modalRef.value.classList.remove('modal_warning')
        }
    })

    defineExpose({
        warningRef
    })
</script>
