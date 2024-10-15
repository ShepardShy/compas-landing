import { defineStore } from 'pinia'

import storeTable from "./tableScripts/Table";
import storeFilter from "./tableScripts/Filter";

// Стор для хранения сторов с таблицами
export const useTableStore = defineStore('tableStore', {
    // states
    state: () =>  {
        return {
            objects: {}
        }
    },
    persist: {
        storage: persistedState.localStorage,
    },
    // actions
    actions: {
        /*  Хранилища  */

        // Инициализация нового хранилища
        async initObjectStore(slug, isDetailsTab = false) {
            await this.addStore(slug, isDetailsTab)
        },

        // Добавление нового хранилища
        async addStore(slug, isDetailsTab = false) {
            this.objects[slug] = {
                // Таблица
                table: {
                    // Таблица
                    tableKeys: [],
                    tableData: [],
                    socketRows: {
                        header: [],
                        body: []
                    },

                    // Сортировка по ключу
                    sortItem: {
                        key: null,
                        order: null
                    },

                    tableFooter: {
                        pages: 1,
                        activePage: 1,
                        count: 25
                    },

                    permissions: {
                        read_p: "Y",
                        create_p: "Y",
                        update_p: "Y",
                        delete_p: "Y",
                        export_p: "Y",
                        import_p: "Y"
                    },

                    countRows: 0,
                    restrictions: {
                        count: 0
                    },

                    loaderState: false,

                    // Свойства таблицы
                    key: 'table',
                },

                // Фильтр
                filter: {
                    activeItem: null,
                    input: '',
                    fields: [],
                    search: [],
                    creatingItem: null,
                    savedFields: [],
                    backupFields: [],
                    loading: false,
                    buttonLoading: false,
                },

                // Состояние и загрузка страницы
                state: null,
                loaderStatus: null,
                loaderButton: false,
                removingItem: null,
                showWarning: false,
                saveSettings: false,
                fromModal: {
                    id: 0,
                    status: null,
                    isModal: false
                },

                // Категории
                categories: [],
                selectedCategory: 0,
                buttonActions: [],

                // Прочее
                tabs: [],
                isDetailsTab: isDetailsTab,
                slug: slug,
                trash: false,
                title: null,
                headerTitle: null
            }
        },

        // Полное очищение хранилища
        clearAllStores() {
            storeTable.clearAllStores(this)
        },





        /*  Страница  */

        // Получение информации на странице
        async getData(slug, route) {
            await storeTable.getData(route, slug, this)
        },


        /*  Фильтр  */

        // Поиск по фильтру
        searchFilter(params, slug) {
            storeFilter.searchFilter(params, slug, this, false)
        },

        // Создание нового фильтра
        createFilter(data, slug, trashed = false) {
            storeFilter.createFilter(data, slug, trashed, this)
        },

        // Обновление фильтра
        updateFilter(data, slug, trashed = false) {
            storeFilter.updateFilter(data, slug, trashed)
        },

        // Удаление фильтра
        deleteFilter(data, slug, trashed = false) {
            storeFilter.deleteFilter(data, slug, trashed)
        },

        // Сортировка сохраненных фильтров
        changeOrderFilters(data, slug, trashed = false) {
            storeFilter.changeOrderFilters(data, slug, trashed)
        }
    }
})
