import isEmpty from 'lodash/isEmpty'
import api from '~/helpers/api'
import commonScripts from '~/commonScripts/commonScripts'
import storeFilter from "./Filter";

import { useUserStore } from '@/stores/userStore.js'
import { useCommonStore } from '~/stores/commonStore'
import { useTableStore } from '~/stores/tableStore'

export default {
    // Создание строки
    async createRow(slug) {
        const tableStore = useTableStore()
        let response = null
        try {
            tableStore.objects[slug].loaderButton = true
            response = await api.callMethod("POST", `objects/${slug}`, {});
        } catch (error) {
            commonScripts.showNotification({
                title: 'Ошибка при сохранении',
                description: `Во время сохранения произошла ошибка. Пожалуйста, попробуйте ещё раз.`
            }, 'error')
            console.log(error);
        } finally {
            tableStore.objects[slug].loaderButton = false
            return response
        }
    },

    // Получение данных
    async getData(route, slug, store, type = 'get') {
        let localStore = store.trash ? store : store.objects[slug]

        // Установка параметров
        const setParams = () => {
            let params = {
                filter: null,
                address: null
            }

            if (route && (isEmpty(route.query) || route.query.object)) {
                params.address = {
                    q: '',
                    page: localStore.table.tableFooter.activePage ?? 1
                }

                if (route.query.sort_field) {
                    params.address.sort_field = route.query.sort_field 
                    params.address.sort_order = route.query.sort_order 
                }
            } else {
                params.address = commonScripts.transformParams('addressToAddress')
                params.filter = commonScripts.transformParams('addressToParams')
                delete params.address.tab
                delete params.address.object

                if (isEmpty(params.address)) {
                    params.address = {
                        q: '',
                        sort_field: params.address.sort_field ?? 'id',
                        sort_order: params.address.sort_order ?? 'desc',
                        page: localStore.table.tableFooter.activePage ?? 1
                    }
                }
            }

            return params
        }

        // Установка полученных данных
        const setData = async (params) => {
            // Обновление фильтра
            const updateFilter = async () => {
                await storeFilter.getFilterFields(localStore, gettingData.fields)
                localStore.filter.savedFields = gettingData.filters
                localStore.filter.activeParams = params.filter
            }

            // Обновление данных в таблице
            const updateTable = () => {
                if (type == 'get') {
                    localStore.table.tableKeys = gettingData.table
                }
                localStore.table.tableData = gettingData.list.data
                localStore.table.tableFooter = {
                    pages: gettingData.list.last_page,
                    activePage: gettingData.list.current_page,
                    count: gettingData.list.per_page
                }
            }

            // Установка прочих данных
            const setOtherData = async () => {
                const commonStore = useCommonStore()
                commonStore.modalInfo = gettingData.entities
                localStore.buttonActions = gettingData.list.buttons
                localStore.tabs = gettingData.tabs
                localStore.permissions = gettingData.permissions
                localStore.categories = gettingData.categories.concat([
                    { 
                        id: null, 
                        name: 'Все категории', 
                        is_permanent: true, 
                        children: [] 
                    }
                ])

                localStore.table.sortItem = {
                    key: gettingData.list.sort_field,
                    order: gettingData.list.sort_order
                }
                localStore.table.countRows = gettingData.list.count

                if (localStore.trash && slug == 'users') {
                    let restrictUsers = await api.callMethod("GET", `objects/${slug}/compose?${new URLSearchParams(params.address).toString()}`)
                    
                    localStore.table.restrictions = {
                        count: gettingData.list.restrictions == {} ? null : gettingData.list.restrictions.count - restrictUsers.list.data.length
                    }

                    console.log(localStore.table.restrictions);
                } else {
                    localStore.table.restrictions = gettingData.list.restrictions == {} ? {
                        count: null
                    } : gettingData.list.restrictions
                }


                if (localStore.trash) {
                    localStore.tabs = gettingData.list.tabs
                }
            }

            let gettingData = await api.callMethod("GET", `objects/${slug}/compose?${localStore.trash ? 'trashed=1&' : ''}${new URLSearchParams(params.address).toString()}`);

            if (gettingData.status == 403) {
                return
            } else {
                await updateFilter()
                updateTable()
                setOtherData()
            }
        }

        try {
            localStore.table.loaderState = type == 'get' ? 'loading' : 'filtering'

            let params = setParams()
            await setData(params)
            
        } catch (error) {
            commonScripts.showNotification({
                title: 'Ошибка при получении данных',
                description: `Во время получения данных произошла ошибка. Пожалуйста, попробуйте ещё раз.`
            }, 'error')
            console.log(error);
        } finally {
            localStore.table.loaderState = null
        }
    },

    async getTabData(params, slug, localStore, type = 'get') {
        // Установка полученных данных
        const setData = async (params) => {
            // Обновление данных в таблице
            const updateTable = async () => {
                localStore.table.tableKeys = gettingData.table
                localStore.table.tableData = gettingData.list.data
                localStore.table.tableFooter = {
                    pages: gettingData.list.last_page,
                    activePage: gettingData.list.current_page,
                    count: gettingData.list.per_page
                }

                localStore.table.sortItem = {
                    key: gettingData.list.sort_field,
                    order: gettingData.list.sort_order
                }
            }

            const filterOptions = `${transformParams(params.fieldValue)}&${new URLSearchParams(params.table).toString() !== '' ? new URLSearchParams(params.table).toString() + '&' : ''}`
            
            let gettingData = await api.callMethod("GET", `objects/${slug}/compose?${filterOptions}is_slug=true`);

            console.log(gettingData);

            if (gettingData.status != 403 && gettingData.status != 404 && gettingData.status != 500) {
                await updateTable()
            }
        }

        // Преобразование параметров
        const transformParams = (params) => {
            let request = []
            params = params.filter(p => p != null)
            for (let param of params) {
                request.push(`filter[id][]=${param}`)
            }

            request = request.join('&')

            return request
        }

        try {
            localStore.table.loaderState = type == 'get' ? 'loading' : 'filtering'
            await setData(params)
        } catch (error) {
            commonScripts.showNotification({
                title: 'Ошибка при получении данных',
                description: `Во время получения данных произошла ошибка. Пожалуйста, попробуйте ещё раз.`
            }, 'error')
            console.log(error);
        } finally {
            localStore.table.loaderState = null
        }
    },

    // Обновление данных в строках
    async saveRows(data, slug, isModal = false, localStore = null) {
        const tableStore = useTableStore()

        try {

            if (tableStore.objects[slug]) {
                tableStore.objects[slug].table .loaderState = 'actionLoad'
            }

            if (isModal) {
                localStore.canChangeTab = false
            }

            await api.callMethod("PUT", `objects/${slug}/batch`, {
                rows: data
            });
        } catch (error) {
            commonScripts.showNotification({
                title: 'Ошибка при сохранении',
                description: `Во время сохранения произошла ошибка. Пожалуйста, попробуйте ещё раз.`
            }, 'error')
            console.log(error);
        } finally {
            if (tableStore.objects[slug]) {
                tableStore.objects[slug].table .loaderState = null
            }

            if (isModal) {
                localStore.canChangeTab = true
            }
        }
    },

    // Установка вотображаемого количества элементов в таблице
    async setVisibleElems(count, slug) {
        try {
            await api.callMethod("POST", `tables/${slug}/per_page`, {
                per_page: count
            });
        } catch (error) {
            commonScripts.showNotification({
                title: 'Ошибка при сохранении',
                description: `Во время сохранения произошла ошибка. Пожалуйста, попробуйте ещё раз.`
            }, 'error')
            console.log(error);
        } 
    },


    // Удаление строк
    async deleteRows(data, slug, route) {
        const tableStore = useTableStore()
        try {
            tableStore.objects[slug].table.loaderState = 'actionLoad'
            await api.callMethod("DELETE", `objects/${slug}`, {
                ids: data
            });
            await this.getData(route, slug, tableStore)
        } catch (error) {
            commonScripts.showNotification({
                title: 'Ошибка при сохранении',
                description: `Во время сохранения произошла ошибка. Пожалуйста, попробуйте ещё раз.`
            }, 'error')
            console.log(error);
        } finally {
            tableStore.objects[slug].table.loaderState = null
        }
    },

    // Сохранение настроек колонок
    async saveFields(data, slug) {
        let requestSlug = ''

        switch (data.role) {
            case 'all':
                requestSlug = `/${slug}/all`
                break;

            case 'myself':
                requestSlug = `/${slug}`
                break;

            case 'admin_fines':
                requestSlug = '/admin_fines'
                break;

            default:
                requestSlug = `/${slug}/${data.role}`
                break;
        }

        await api.callMethod("POST", `tables${requestSlug}`, {
            fields: data.fields,
            sort_order: data.sortItem.order,
            sort_field: data.sortItem.key
        });
    },

    // Копирование строки
    async copyRow(id, slug) {
        let response = await api.callMethod("POST", `objects/${slug}/${id}/copy`, {});
        return response
    },

    // Скачивание экселя
    async downloadExcel(options, slug) {
        let response = await api.callMethod("GET", `objects/${slug}/export${options}`);
        window.open(response.link, '_blank')
    },

    // Обновление таблицы продуктов
    async updateProducts(data, id, slug, localStore) {
        try {
            localStore.loaderState = 'actionLoad'
            localStore.canChangeTab = false
            await api.callMethod("PUT", `${slug}/${id}/set_products`, {
                products: data
            });
        } catch (error) {
            commonScripts.showNotification({
                title: 'Ошибка при сохранении',
                description: `Во время сохранения произошла ошибка. Пожалуйста, попробуйте ещё раз.`
            }, 'error')
            console.log(error);
        } finally {
            localStore.loaderState = null
            localStore.canChangeTab = true
        }
    },

    async paymentFine(id) {
        try {
            let response = await api.callMethod("POST", `gibdd/pay/${id}`,);
            if (response.error) {
                commonScripts.showNotification({
                    title: response.error,
                    description: ``
                }, 'error')

                if (response.error == 'Недостаточно средств на балансе') {
                    navigateTo('/settings/?tab=tariffs')
                }
            }
        } catch (error) {
            commonScripts.showNotification({
                title: 'Ошибка при сохранении',
                description: `Во время сохранения произошла ошибка. Пожалуйста, попробуйте ещё раз.`
            }, 'error')
        }
    },

    // Полное очищение глобального хранилища
    clearAllStores(store) {
      store = {
          tabs: [],
          activeTab: {},
          objects: {}
      }
    },

    // Авторизация под другим пользователем
    async authUser(id) {
        const userStore = useUserStore()
        let response = await api.callMethod("POST", `auth/${id}`);
        userStore.userToken = response.token
        window.location.replace(response.url)
    },

    async authPortal(domen) {
        let response = await api.callMethod("POST", `auth_account/${domen}`);
        window.location.replace(`https://${domen}.compas.pro${response.url}/?token=${response.token}`)
    },

    // Проверка штрафов
    async checkFines() {
        let response = await api.callMethod("POST", `gibdd/check`);
        if (response.total > 0) {
            commonScripts.showNotification({
                title: 'Оповещение',
                description: `В таблицу было добавлено ${response.total} новых штрафов`
            }, 'notice')
        } else {
            commonScripts.showNotification({
                title: 'Оповещение',
                description: `Новых штрафов не обнаружено`
            }, 'notice')
        }
    },

    // Получение данных для монеты
    async getMonetaPayID(payment) {
        await api.callMethod("POST", `gibdd/moneta_pay`, {
            transaction_id: payment.transaction_id,
            amount: payment.value
        });
    },

    // Получение табов в корзине
    async getTrashTabs() {
        return await api.callMethod("GET", `tabs/trash`);
    }
}
