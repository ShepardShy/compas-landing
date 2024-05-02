export default {
    // Установка курсора
    setCursor(cursor) {
        document.body.style.setProperty("--cursorStyle", `${cursor}`)
    },

    // Скрытие всех выпадающих списков
    hideAllDetails(className, event = null) {
        if (className == 'details' || event == null) {
            document.querySelectorAll(className).forEach(element => {
                element.removeAttribute('open')
            })
        } else {
            if (event != null) {
                if (event.target.closest(className) == null) {
                    document.querySelectorAll(className).forEach(element => {
                        element.removeAttribute('open')
                    })
                } else {
                    if (event.target.closest('.section__setting-option__summary')) {
                        targetObject = event.target
                        return
                    }

                    if (!(targetObject === event.target)) {
                        document.querySelectorAll(className).forEach(element => {
                            element.removeAttribute('open')
                        })
                    }
                    targetObject = event.target
                }
            }
        }
    },

    // Клонирование перетаскиваемого элемента c созданием родителя
    cloningDraggableComponent(data, parentClass, subclass) {
        if (document.getElementById('clone-elem') == null) {
            let parentElem = document.createElement("div")
            let elem = data.target.cloneNode(true)
            parentElem.classList.add(parentClass)
            parentElem.appendChild(elem)
            parentElem.id = "clone-elem";
            parentElem.classList.add('clone-elem')
            elem.style.width = `${ data.target.offsetWidth}px`
            if (subclass != null) {
                elem.querySelector(subclass.selector).classList.add(subclass.class)
            }
            document.body.appendChild(parentElem);
            data.dataTransfer.setDragImage(parentElem, 5, 8);
        }
    },

    // Клонирование перетаскиваемого элемента без создания родителя
    cloningDraggableSection(data, subclass) {
        if (document.getElementById('clone-elem') == null) {
            let elem = data.target.cloneNode(true)
            elem.id = "clone-elem";
            elem.classList.add('clone-elem')
            elem.style.width = `${ data.target.offsetWidth}px`
            if (subclass != null) {
                elem.querySelector(subclass.selector).classList.add(subclass.class)
            }
            document.body.appendChild(elem);
            data.dataTransfer.setDragImage(elem, 5, 8);
        }
    },

    // Удаление перетаскиваемого элемента
    removingDraggableComponent() {
        let removingItem = document.getElementById('clone-elem')
        if (removingItem != null) {
            removingItem.remove()
        }
    },

    // Очистка хранилища
    clearStorage(store) {
        for (let key in store) {
            clearFilter(store, key)
            clearTableData(store, key)
        }
        clearPage(store)
    },

    // Снять выделение со всех блоков
    clearSelection(event) {
        if (window.getSelection) {window.getSelection().removeAllRanges();}
        else if (document.selection) {document.selection.empty();}
    },

    async getYandexCoords(data) {
        let request = await fetch(`https://geocode-maps.yandex.ru/1.x/?${data}`)
        let response = await request.json()
        return response
    },

    // Проверка переменной на число
    isInteger(value) {
        return /^\d+$/.test(value);
    },

    checkingLink(routePath, link) {
        let routeMatch = routePath.match(link)
        if (routeMatch != null) {
            if (routeMatch.input.substr(routeMatch.input.length - 1) == '/') {
                routeMatch.input = routeMatch.input.slice(0, -1)
            } else {
                let routeString = routeMatch.input.split('/')
                if (this.isInteger(routeString[routeString.length - 1])) {
                    routeString.pop()
                    routeMatch.input = routeString.join('/')
                }
            }
        }
        return routeMatch
    },

    // Прокручивание страницы вверх вместе с модальными окнами
    scrollPageTop() {
        window.scrollTo(0, 0);
        let modals = document.querySelectorAll('.modal__content')
        modals.forEach(modal => {
            modal.scrollTop = 0
        });
    }
}

let targetObject = null

const clearTableData = (store, key) => {
    if (key == 'sortedColumn') {
        store[key] = null
    } else {
        store[key] = []
    }
}

const clearFilter = (store, key) => {
    switch (key) {
        case 'filterInput':
            store[key] = ''
            break;
        case 'filterFields':
            store[key] = []
            break;
        case 'searchFilters':
            store[key] = []
            break;
        case 'creatingFilter':
            store[key] = null
            break;
        case 'savedFilterFields':
            store[key] = []
            break;
        default:
            break;
    }
}

const clearPage = (store) => {
    store.table.pageInfo = {
        activePage: 1,
        totalPages: 1,
        totalElems: 0,
        countSelect: 0,
        visibleElems: 25,
    }
}
