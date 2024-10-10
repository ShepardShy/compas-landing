<template>
    <AppLoader class="table-template__loader" ref="loaderRef"/>
    
    <div class="table-template__buttons" ref="buttonsRef" :style="`--startButtons: ${buttonStartRect}px`" :class="`table-template__buttons_${buttonsPos}`">
        <div class="scroll-button scroll-button_left"
            ref="buttonScrollLeftRef"
            :style="`--buttonPos: ${leftButtonPos}px`"
            @mousedown ="() => isPad ? null : actionScroll({action: 'scrollingBlock', value: 'left'})"
            @mouseup="() => isPad ? null : mouseHover = false"
            @touchstart ="() => isPad ? actionScroll({action: 'scrollingBlock', value: 'left'}) : null"
            @touchend="() => isPad ? mouseHover = false : null"
        ></div>
        <div class="scroll-button scroll-button_right"
            ref="buttonScrollRightRef"
            :style="`--buttonPos: ${rightButtonPos}px`"
            @mousedown ="() => isPad ? null : actionScroll({action: 'scrollingBlock', value: 'right'})"
            @mouseup="() => isPad ? null : mouseHover = false"
            @touchstart ="() => isPad ? actionScroll({action: 'scrollingBlock', value: 'right'}) : null"
            @touchend="() => isPad ? mouseHover = false : null"     
        ></div>
    </div>

    <div class="table__empty-block">
        Нет данных
    </div>
</template>

<script setup>
    import './ScrollButtons.scss';
    
    import _ from 'lodash'

    import AppLoader from '@/components/AppLoader/AppLoader.vue';
    import commonScripts from '@/commonScripts/commonScripts.js';

    let mouseHover = ref(false)

    const loaderRef = ref(null)
    const buttonScrollLeftRef = ref(null)
    const buttonScrollRightRef = ref(null)
    const tableHeadRef = ref(null)
    const buttonsPos = ref('start')
    const buttonsRef = ref(null)

    const isPad = ref(false)

    let leftButtonPos = ref(0)
    let rightButtonPos = ref(0)

    const tableHeadCopy = ref(null)

    const tableRef = inject('tableRef')
    const isCanSort = inject('isCanSort')
    const sectionRef = inject('sectionRef')
    const scrollPosition = inject('scrollPosition')
    const sortItem = inject('sortItem')
    const menu = inject('menu')
    const footerData = inject('footerData')
    const selectAll = inject('selectAll')
    const bodyData = inject('bodyData')
    const actionState = inject('actionState')
    const buttonStartRect = ref(0)

    const props = defineProps({
        tableRef: {
            default: null
        },
        isHaveScrollingHeader: {
            default: true,
            type: Boolean
        },
        updateScrollButton: {
            default: null
        }
    })

    const emit = defineEmits([
        'callAction'
    ])

    let clickSetting = ref({
        id: -1,
        delay: 500,
        clicks: 0,
        timer: null
    })

    const scroolingState = ref(null)

    onMounted(async () => {
        let modal = checkModal()
        tableHeadRef.value = tableRef.value.querySelector('.table__header')
        actionScroll({action: 'showCopyHeader', value: null})

        if (props.isHaveScrollingHeader) {
            if (modal) {
                modal.addEventListener('scroll', throt_funScroll)
                modal.addEventListener('resize', setButtonPos);
            } else {
                window.addEventListener('scroll', throt_funScroll)
                window.addEventListener('resize', setButtonPos);
            }
        }

        if (tableRef.value.parentNode) {
            tableRef.value.parentNode.addEventListener('scroll', scrollXThrottling)
        }

        if (tableRef.value) {
            new ResizeObserver(resizeTable).observe(tableRef.value)
        }

    })
    
    onUnmounted(() => {
        let modal = checkModal()

        if (props.isHaveScrollingHeader) {
            if (modal) {
                modal.removeEventListener('scroll', throt_funScroll)
                modal.removeEventListener('resize', setButtonPos);
            } else {
                window.removeEventListener('scroll', throt_funScroll);
                window.removeEventListener('resize', setButtonPos);
            }
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

    // Скролл таблицы и кнопок
    const actionScroll = (data) => {
        // Установка позиции у кнопок
        const setPosition = () => {           
            // старт таблицы
            if (sectionRef.value && sectionRef.value.sectionRef.getBoundingClientRect().top > 0) {
                const rect = sectionRef.value.sectionRef.getBoundingClientRect();

                const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
                buttonsPos.value = 'start'

                if (isFullyVisible) {
                    buttonStartRect.value = sectionRef.value.sectionRef.getBoundingClientRect().top + 160
                    return (sectionRef.value.sectionRef.offsetHeight - 82) / 2 - 27
                } else {
                    buttonStartRect.value = sectionRef.value.sectionRef.getBoundingClientRect().top + 160
                    return (window.innerHeight - sectionRef.value.sectionRef.getBoundingClientRect().top - 82) / 2 - 17
                }
            // конец таблицы
            } else {
                if (sectionRef.value) {
                    let startPosScrollBlock = sectionRef.value.sectionRef.getBoundingClientRect().top +  window.pageYOffset - document.body.clientTop
                    if (sectionRef.value.sectionRef.getBoundingClientRect().height + startPosScrollBlock < window.scrollY + window.innerHeight) {
                        buttonsPos.value = 'end'
                        buttonStartRect.value = sectionRef.value.sectionRef.getBoundingClientRect().top + 160
                        return window.innerHeight / 2 + (window.scrollY - startPosScrollBlock - startPosScrollBlock + 5)
                    }
                    // середина таблицы
                    else {
                        buttonStartRect.value = sectionRef.value.sectionRef.getBoundingClientRect().top + 160
                        buttonsPos.value = 'center'
                        return window.innerHeight / 2 + window.scrollY - startPosScrollBlock - 41
                    }
                }
            }
        }

        // Отображение псевдошапки
        const showCopyHeader = () => {
            let localTableHeader = tableRef.value.querySelector('.table__header')
            let tableBody = tableRef.value.querySelector('.table__body')
            if (!localTableHeader) return  
            let tableHeaderTop = localTableHeader.getBoundingClientRect().top
            let tableBodyTop = tableBody.getBoundingClientRect().bottom - 60
            let copyHeader = tableRef.value.querySelector('.table__header_copy')

            const getWidth = () => {
                let cellsWidth = []
                for (let cell of localTableHeader.querySelectorAll('.table__item')) {
                    cellsWidth.push(cell.offsetWidth)
                }
                return cellsWidth
            }

            const setWidth = () => {
                let arrWidth = getWidth()
                copyHeader.querySelectorAll('.table__item').forEach((element, index) => {
                    element.width = `${arrWidth[index]}px`
                    element.style.setProperty("--defaultWidth", `${arrWidth[index].toFixed(2)}px`)
                });
            }

            if (tableHeaderTop <= 0 && tableBodyTop >= 0) {
                if (copyHeader == null) {
                    copyHeader = localTableHeader.cloneNode(true);
                    setWidth()
                    copyHeader.classList.add('table__header_copy')
                    tableRef.value.appendChild(copyHeader)
                    copyHeader.addEventListener('click', doubleClick)
					copyHeader.scroll(tableRef.value.parentNode.scrollLeft, 0);
                }
            } else {
                if (copyHeader) {
                    copyHeader.removeEventListener('click', doubleClick)
                    copyHeader.remove()
                    tableHeadCopy.value = null
					copyHeader.scroll(tableRef.value.parentNode.scrollLeft, 0);
                }
            }
        }
        
        const syncHeaders = () => {
            let copyHeader = tableRef.value.querySelector('.table__header_copy')

            if (copyHeader) {
                let localTableHeader = tableRef.value.querySelector('.table__header')

                const getWidth = () => {
                    let cellsWidth = []
                    for (let cell of localTableHeader.querySelectorAll('.table__item')) {
                        cellsWidth.push(cell.offsetWidth)
                    }
                    return cellsWidth
                }

                const setWidth = () => {
                    let arrWidth = getWidth()
                    copyHeader.querySelectorAll('.table__item').forEach((element, index) => {
                        element.width = `${arrWidth[index]}px`
                        element.style.setProperty("--defaultWidth", `${arrWidth[index].toFixed(2)}px`)
                    });
                }

                setWidth()
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

            // Отображение псевдошапки
            case 'showCopyHeader':
                showCopyHeader()
                break;

            case 'syncHeaders':
                syncHeaders()
                break;
            default:
                break;
        }
    }

    // Троттлинг скролла по вертикали
    const throt_funScroll = () => {
        scrollPosition.value = actionScroll({action: 'setPosition', value: null})
        actionScroll({action: 'showCopyHeader', value: null})
    }

    // Двойной клик для псевдошапки
    const doubleClick = (event) => {
        let eventKey =  event.target.closest('.table__item').getAttribute('data-key')

        if (event.target.closest('.form-item__checkbox') != null && eventKey == 'isChoose') {
            selectAllRows(!selectAll.value)
        }

        clickSetting.value.clicks++;
        if (clickSetting.value.clicks === 1) {
            clickSetting.value.timer = setTimeout( () => {
            clickSetting.value.clicks = 0
            }, clickSetting.value.delay);
        } else {
            if (isCanSort && (eventKey != 'isChoose') && (eventKey != 'actions')) {
                sortItem.value = {
                    key: eventKey,
                    order: sortItem.value.key == eventKey ? (sortItem.value.order == 'desc' ? 'asc' : 'desc') : 'desc'
                }
                menu.value.saves.isShow = true
                footerData.value.activePage = 1

                let copyHeader = tableRef.value.querySelector('.table__header_copy')
                let findedIcon = copyHeader.querySelector('.icon__sort').cloneNode(true)

                if (sortItem.value.order == 'asc')  {
                    findedIcon.classList.add('icon__sort_up')
                } else {
                    findedIcon.classList.remove('icon__sort_up') 
                }
                
                copyHeader.querySelectorAll('.icon__sort').forEach(item => {
                    item.remove()
                })

                let findedField = [...copyHeader.querySelectorAll('.table__item')].find(p => p.getAttribute('data-key') == eventKey)
                findedField.querySelector('.table-item__content').appendChild(findedIcon)

                emit('callAction', {
                    action: 'getTableData',
                    value: null
                })
            }
            window.getSelection().empty();
            clearTimeout(clickSetting.value.timer);  
            clickSetting.value.clicks = 0;
        }   
    }  

    // Выбор всех строк
    const selectAllRows = (data) => {
        selectAll.value = data
        bodyData.value.forEach(row => {
            row.isChoose = selectAll.value
        });

        if (data) {
            actionState.value = props.isTrash ? 'restoring' : 'editting'
        } else {
            actionState.value = null
        }
    }
    
    // Установка положения кнопок
    const setButtonPos = () => {
        leftButtonPos.value = tableRef.value.parentNode.getBoundingClientRect().left
        rightButtonPos.value = tableRef.value.parentNode.getBoundingClientRect().left + tableRef.value.parentNode.offsetWidth - 40
        actionScroll({action: 'syncHeaders', value: null})

        isPad.value = window.innerWidth <= 900
    }

    // Троттлинг скролла по горизонтали
    const scrollXThrottling = _.throttle(() => {
        if(scroolingState.value !== null) {
            tableRef.value.parentNode.classList.add('element_scrolling')
            clearTimeout(scroolingState.value);
        }
        scroolingState.value = setTimeout(function() {
            tableRef.value.parentNode.classList.remove('element_scrolling')
        }, 150);

        actionScroll({action: 'setButtonsVisible', value: tableRef.value.parentNode})
        tableHeadCopy.value = tableRef.value.querySelector('.table__header_copy')
        
        if (tableHeadCopy.value != null) {
            tableHeadCopy.value.scroll(tableRef.value.parentNode.scrollLeft, 0)
        }
    }, 5)

    const resizeTable = () => {
        if (tableRef.value) {
            actionScroll({action: 'setButtonsVisible', value: tableRef.value.parentNode})
        }
        scrollPosition.value = actionScroll({action: 'setPosition', value: null})
        setButtonPos()
    }

    watch(() => props.updateScrollButton, () => {
        if (tableRef.value) {
            actionScroll({action: 'setButtonsVisible', value: tableRef.value.parentNode})
            scrollPosition.value = actionScroll({action: 'setPosition', value: null})
        }
    })
</script>