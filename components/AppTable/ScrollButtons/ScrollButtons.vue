<template>
    <AppLoader class="table-template__loader" ref="loaderRef"/>
    
    <div class="table-template__buttons">
        <div class="scroll-button scroll-button_left"
            ref="buttonScrollLeftRef"
            @mouseover ="() => actionScroll({action: 'scrollingBlock', value: 'left'})"
            @mouseleave="() => mouseHover = false"
        ></div>
        <div class="scroll-button scroll-button_right"
            ref="buttonScrollRightRef"
            @mouseover ="() => actionScroll({action: 'scrollingBlock', value: 'right'})"
            @mouseleave="() => mouseHover = false"                
        ></div>
    </div>

    <div class="table__empty-block">
        Нет данных
    </div>
</template>

<script setup>
    import './ScrollButtons.scss';
    
    import _ from 'lodash'
    import { ref, onMounted, inject, onUnmounted, watch } from 'vue'

    import AppLoader from '@/components/AppLoader/AppLoader.vue';

    let mouseHover = ref(false)

    const loaderRef = ref(null)
    const buttonScrollLeftRef = ref(null)
    const buttonScrollRightRef = ref(null)
    const tableHeadRef = ref(null)

    const fields = inject('fields')
    const tableRef = inject('tableRef')
    const sectionRef = inject('sectionRef')
    const scrollPosition = inject('scrollPosition')

    onMounted(async () => {
        tableHeadRef.value = tableRef.value.querySelector('thead')
        window.addEventListener('scroll', throt_funScroll)
        tableRef.value.parentNode.addEventListener('scroll', scrollXThrottling)
    })
    
    onUnmounted(() => {
        window.removeEventListener('scroll', throt_funScroll)
    })

    // Скролл таблицы и кнопок
    const actionScroll = (data) => {
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

        // Скролл при наведении на кнопку
        const scrollingBlock = (pos) => {
            // Смещение блока по иксу при наведении
            const scrollX = (scrollSection, pos) => {
                if (!mouseHover.value) {
                    return
                }
                setButtonsVisible(scrollSection)
                if (pos == 'right') {
                    if (scrollSection.scrollWidth == scrollSection.scrollLeft + scrollSection.offsetWidth) {
                        return
                    }
                    scrollSection.scrollLeft += 5
                    scrollSection.scrollTo({
                        left: scrollSection.scrollLeft,
                        top: 0
                    })
                } else {
                    if (scrollSection.scrollLeft == 0) {
                        return
                    }
                    scrollSection.scrollLeft -= 5
                    scrollSection.scrollTo({
                        left: scrollSection.scrollLeft,
                        top: 0
                    })
                }
                setTimeout(() => {
                    scrollX(scrollSection, pos)
                }, 0.1);
            }

            mouseHover.value = true
            scrollX(tableRef.value.parentNode, pos)
        }

        // Отображение видимости кнопок
        const setButtonsVisible = (scrollSection) => {
            if (scrollSection.scrollWidth == scrollSection.offsetWidth) {
                buttonScrollLeftRef.value.classList.add('scroll-button_disabled')
                buttonScrollRightRef.value.classList.add('scroll-button_disabled')
                return
            } else if (scrollSection.scrollLeft == 0) {
                buttonScrollLeftRef.value.classList.add('scroll-button_disabled')
                buttonScrollRightRef.value.classList.remove('scroll-button_disabled')
            } else if (scrollSection.scrollWidth == scrollSection.scrollLeft + scrollSection.offsetWidth) {
                buttonScrollLeftRef.value.classList.remove('scroll-button_disabled')
                buttonScrollRightRef.value.classList.add('scroll-button_disabled')
            } else {
                buttonScrollRightRef.value.classList.remove('scroll-button_disabled')
                buttonScrollLeftRef.value.classList.remove('scroll-button_disabled')
            }
        }

        switch (data.action) {
            // Установка позиции у кнопок
            case 'setPosition':
                return setPosition()

            // Скролл при наведении на кнопку
            case 'scrollingBlock':
                scrollingBlock(data.value)
                break;

            // Отображение видимости кнопок
            case 'setButtonsVisible':
                setButtonsVisible(data.value)
                break;
            default:
                break;
        }
    }

    // Троттлинг скролла по вертикали
    const throt_funScroll = () => {
        scrollPosition.value = actionScroll({action: 'setPosition', value: null})
    }

    // Троттлинг скролла по горизонтали
    const scrollXThrottling = _.throttle(() => {
        actionScroll({action: 'setButtonsVisible', value: tableRef.value.parentNode})
    }, 20)

    watch(() => fields.value, () => {
        setTimeout(() => {
            actionScroll({action: 'setButtonsVisible', value: tableRef.value.parentNode})
            scrollPosition.value = actionScroll({action: 'setPosition', value: null})
        }, 1000);
    })
</script>