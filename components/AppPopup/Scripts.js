export default {
    // Закрытие выпадающего списка
    hideDetails(element) {
        switch (element) {
            // Вывод в консоль, если элемент не был получен
            case null:
                console.error('Element not found');
                break;
            // Вывод в консоль, если элемент не был получен
            case undefined:
                console.error('Element not found');
                break;
            // Удаление у всех элементов
            case 'All':
                let data = document.querySelectorAll('.popup')
                data.forEach(element => {
                    element.removeAttribute('open')
                    element.classList.remove('popup_up')
                    element.classList.remove('popup_visible')
                    element.classList.remove('popup_right')
                });
                break
            // Удаление у определенного элемента 
            default:
                element.removeAttribute('open')
                element.classList.remove('popup_up')
                element.classList.remove('popup_visible')
                element.classList.remove('popup_right')
            break;
        }
    },

    // Установка позиции выплывающего списка
    setDropdownPosition(element) {
        let scrollBlock = null
        scrollBlock = element.closest('.section__scroll-area')

        if (element != null && !element.classList.contains('popup_visible')) {
            setTimeout(() => {
                let dropdown = element.querySelector('.popup__content')
                let dropdownRect = dropdown.getBoundingClientRect()

                if (scrollBlock != null) {
                    let scrollBlockRect = scrollBlock.getBoundingClientRect()
                    if (
                        (dropdownRect.top + dropdownRect.height >= scrollBlockRect.height + scrollBlockRect.top) || 
                        (dropdownRect.top + dropdownRect.height > window.innerHeight)
                    ) {
                        element.classList.add('popup_up')
                    } else {
                        element.classList.remove('popup_up')
                    }


                    if (scrollBlockRect.right < dropdownRect.right) {
                        element.classList.add('popup_right')
                    } else {
                        element.classList.remove('popup_right')
                    }
                } else {
                    if (dropdownRect.top + dropdownRect.height > window.innerHeight) {
                        element.classList.add('popup_up')
                    } else {
                        element.classList.remove('popup_up')
                    }
                }

                element.classList.add('popup_visible')
            }, 10);
        }
    }
}