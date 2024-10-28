<template>
    <AppLoader class="table-template__loader" ref="loaderRef"/>
    
    <div class="table-template__buttons" ref="buttonsRef" :style="`--startButtons: ${buttonStartRect}px`">
        <div 
            class="scroll-button scroll-button_left"
            ref="buttonScrollLeftRef"
            @mousedown ="() => actionScroll({action: 'scrollingBlock', value: 'left'})"
            @mouseup="() => mouseHover = false"
        ></div>
        <div 
            class="scroll-button scroll-button_right"
            ref="buttonScrollRightRef"
            @mousedown ="() => actionScroll({action: 'scrollingBlock', value: 'right'})"
            @mouseup="() => mouseHover = false"
        ></div>
    </div>
</template>

<script setup>
    import './ScrollButtons.scss';
    
    import throttle from 'lodash/throttle'

    import AppLoader from '@/components/AppLoader/AppLoader.vue';
    import commonScripts from '@/commonScripts/commonScripts.js';

    let mouseHover = ref(false)

    const loaderRef = ref(null)
    const buttonScrollLeftRef = ref(null)
    const buttonScrollRightRef = ref(null)
    const tableHeadRef = ref(null)
    const buttonsRef = ref(null)

    const tableRef = inject('tableRef')
    const sectionRef = inject('sectionRef')
    const scrollPosition = inject('scrollPosition')
    const buttonStartRect = ref(0)

    const props = defineProps({
        isHaveScrollingHeader: {
            default: true,
            type: Boolean
        },
        isMobileCategory: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    const scroolingState = ref(null)

    const setButtonStartRect = (elem) => {
        if (sectionRef.value) {
            let rect = sectionRef.value.sectionRef.getBoundingClientRect()
    
            //  Середина таблицы
            if (rect.top <= 0 && rect.bottom >= elem.innerHeight) {
                buttonStartRect.value = -rect.top + elem.innerHeight / 2 - 32
            } 
            // Таблица уместилась в экран
            else if (rect.top > 0 && rect.bottom < elem.innerHeight) {
                buttonStartRect.value = rect.height / 2
            }
            // Старт таблицы
            else if (rect.top > 0 && rect.bottom > elem.innerHeight) {
                buttonStartRect.value = (elem.innerHeight - rect.top - 36) / 2 - 42
            } 
            // Конец таблицы
            else if (rect.top < 0 && rect.bottom < elem.innerHeight) {
                buttonStartRect.value = -rect.top + (elem.innerHeight - rect.bottom) + 84
            } 
        }
    }

    onMounted(async () => {
        let modal = checkModal()
        tableHeadRef.value = tableRef.value.querySelector('.table__header')

        if (props.isHaveScrollingHeader) {
            if (modal) {
                onScrollStop(modal, () => {
                    setButtonStartRect(modal)
                }, 200);
                setButtonStartRect(modal)
                modal.addEventListener('scroll', checkHeaderCopy)
            } else {
                onScrollStop(window, () => {
                    setButtonStartRect(window)
                }, 200);
                setButtonStartRect(window)
                window.addEventListener('scroll', checkHeaderCopy)
            }
        }

        if (tableRef.value.parentNode) {
            tableRef.value.parentNode.addEventListener('scroll', scrollXThrottling)
            tableRef.value.parentNode.addEventListener('scroll', () => {
                tableRef.value?.querySelector('.table__header_copy').scroll(tableRef.value.parentNode.scrollLeft, 0)
            })
        }

        if (tableRef.value) {
            new ResizeObserver(resizeTable).observe(tableRef.value)
        }

    })

    const checkModal = () => {
        const modalContainer = document.querySelector('.modal') 

        if (modalContainer) {
            let modals = modalContainer.querySelectorAll('.modal__content')
            let lastModal = modals[modals.length - 1]
            return lastModal
        } else {
            return null
        }
    }

    const onScrollStop = (elem = window, callback, timeout = 150) => {
        let isScrolling;

        elem.addEventListener('scroll', () => {
            // Очищаем таймер, если прокрутка продолжается
            clearTimeout(isScrolling);

            // Запускаем таймер на отслеживание остановки
            isScrolling = setTimeout(() => {
                // Когда прокрутка остановлена
                callback();
            }, timeout);
        });
    }

    // Отображение Фиксированного заголовка
    const checkHeaderCopy = () => {           
        const tableBody = tableRef.value?.querySelector('.table__body')
        if (tableBody?.getBoundingClientRect().top < 0 && tableBody?.getBoundingClientRect().bottom - 80 > 0) {
            tableRef.value?.querySelector('.table__header_copy')?.classList.remove('table__header_hidden')
        } else {
            tableRef.value?.querySelector('.table__header_copy')?.classList.add('table__header_hidden')
        }
    }

    // Скролл таблицы и кнопок
    const actionScroll = (data) => {

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
                    commonScripts.clearSelection()
                    scrollX(scrollSection, pos)
                }, 0.1);
            }

            mouseHover.value = true
            scrollX(tableRef.value.parentNode, pos)
        }

        // Отображение видимости кнопок
        const setButtonsVisible = (scrollSection) => {
            if (scrollSection.scrollWidth == scrollSection.offsetWidth) {
                buttonScrollLeftRef.value ? buttonScrollLeftRef.value.classList.add('scroll-button_disabled') : null
                buttonScrollRightRef.value ? buttonScrollRightRef.value.classList.add('scroll-button_disabled') : null
                return
            } else if (scrollSection.scrollLeft == 0) {
                buttonScrollLeftRef.value ? buttonScrollLeftRef.value.classList.add('scroll-button_disabled') : null
                buttonScrollRightRef.value ? buttonScrollRightRef.value.classList.remove('scroll-button_disabled') : null
            } else if (scrollSection.scrollWidth == scrollSection.scrollLeft + scrollSection.offsetWidth) {
                buttonScrollLeftRef.value ? buttonScrollLeftRef.value.classList.remove('scroll-button_disabled') : null
                buttonScrollRightRef.value ? buttonScrollRightRef.value.classList.add('scroll-button_disabled') : null
            } else {
                buttonScrollRightRef.value ? buttonScrollRightRef.value.classList.remove('scroll-button_disabled') : null
                buttonScrollLeftRef.value ? buttonScrollLeftRef.value.classList.remove('scroll-button_disabled') : null
            }
        }

        switch (data.action) {
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

    // Троттлинг скролла по горизонтали
    const scrollXThrottling = throttle(() => {
        if(scroolingState.value !== null) {
            tableRef.value.parentNode.classList.add('element_scrolling')
            clearTimeout(scroolingState.value);
        }
        scroolingState.value = setTimeout(function() {
            tableRef.value.parentNode.classList.remove('element_scrolling')
        }, 150);

        actionScroll({action: 'setButtonsVisible', value: tableRef.value.parentNode})
    }, 5)

    const resizeTable = () => {
        if (tableRef.value) {
            actionScroll({action: 'setButtonsVisible', value: tableRef.value.parentNode})
        }
        scrollPosition.value = checkHeaderCopy()
    }

    watch(() => props.isMobileCategory, () => {
        scrollPosition.value = checkHeaderCopy()
    })
</script>