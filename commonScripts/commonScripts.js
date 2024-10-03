import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useUserStore } from '@/stores/userStore.js'

export default {
    // Очистка выделений
    clearSelection() {
        if(document.selection && document.selection.empty) {
            document.selection.empty();
        } else if(window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
        }
    },

    // Поиск опций
    async getInfoAutocomplete(search, id) {
        const userStore = useUserStore()

        let request = await fetch(`https://opt6.compas.pro/api/objects/search?${id == null ? 'entity=products' : 'field_id=' + id}&q=${search}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userStore.userToken}`,
            }
        })
        return await request.json()
    },

    // Показать уведомление
    showNotification(message, type = 'default', options = {}) {
        const formatedMessage = `
            <h4 class="Toastify__toast-title">${message.title}</h4>
            <p class="Toastify__toast-description">${message.description}</p>
        `

        toast(formatedMessage, {
            ...options,
            type: type,
            position: toast.POSITION.TOP_RIGHT,
            limit: 8,
            pauseOnHover: true,
            dangerouslyHTMLString: true,
            hideProgressBar: true,
            autoClose: 3000,
            newestOnTop: true
        });
    },

    // Трансформирование параметров
    transformParams(type, params = null) {
        // Из адресной строки в параметры
        const addressToParams = () => {
            let response = {}
            let changedKey = null
            const address = window.location.search.split('?')[1];
            const addressFields = address ? address.split('&') : [];
            
            for (let key of addressFields) {
                changedKey = key.split('=')[0]

                if (key.includes('filter')) {
                    if (type == 'addressToParams') {
                        changedKey = changedKey.replace('filter[', '').replace(']', '').replace('filter%5B', '').replace('%5D', '')
                    } else if (type == 'addressToAddress') {
                        changedKey = changedKey.replace('%5B', '[').replace('%5D', ']')
                    }
                    response[changedKey] = decodeURIComponent(key.split('=')[1].replaceAll('+', ' '));
                } else {
                    let value = decodeURIComponent(key.split('=')[1].replaceAll('+', ' '));

                    switch (key.split('=')[0]) {
                        case 'sort_order':
                            response[changedKey] = value == 'undefined' ? 'desc' : value
                            break;
                        case 'sort_field':
                            response[changedKey] = value == 'undefined' ? 'id' : value
                            break;
                        default:
                            response[changedKey] = value
                            break;
                    }

                }
            }

            return response
        }

        // Из параметров в адрессную строку
        const paramsToAddress = () => {
            let requestParams = {}

            for (let key in params) {
                if (!['page', 'per_page', 'trashed','sort_field', 'sort_order', 'q', 'object', 'tab'].includes(key)) {
                    requestParams[`filter[${key}]`] = params[key]
                } else {

                    switch (key) {
                        case 'sort_order':
                            requestParams[key] = params[key] ?? 'id'
                            break;
                        case 'sort_field':
                            requestParams[key] = params[key] ?? 'desc'
                            break;
                        default:
                            requestParams[key] = params[key]
                        break;
                    }
                }
            }

            return requestParams
        }

        switch (type) {
            // Из параметров в адрессную строку
            case 'paramsToAddress':
                return paramsToAddress()
                        
            // Из адрессной строки в параметры
            default:
                return addressToParams()
        }
    },

    // Установка адреса в зависимости от гет параметров
    async setURLParams(data) {
        window.history.replaceState("", "title", `?${new URLSearchParams(data).toString()}`)
    },









    // Получить название страницы (паеределать)
    getPageName(arr) {
        for (let link of arr) {
            if (getCompliance(document.location.pathname) == link.link) {
                return link.name
            } else {
                for (let child of link.children) {
                    if (getCompliance(document.location.pathname) == child.link) {
                        return child.name
                    }
                }
            }
        }
        return 'Без названия'
    }
}

function getCompliance(url) {
    if (document.location.pathname.substring(url.length-1) == '/') {
        return url.substring(0, url.length-1)
    } else {
        return url
    }
}