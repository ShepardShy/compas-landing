import api from "~/helpers/api";
import storeTable from './Table'
import commonScripts from '~/commonScripts/commonScripts'

export default {
    // Получение полей в фильтре
    async getFilterFields(localStore, gettingData) {
        let data = []

        for (let key in gettingData) {
            gettingData[key].key = key
            data.push(gettingData[key])
        }

        localStore.filter.fields = localStore.filter.backupFields = data
    },

    // Поиск по фильтру
    async searchFilter(params, slug, store, isTab = false, type = 'filter') {
        let requestParams = commonScripts.transformParams('paramsToAddress', params)

        if (isTab) {
            requestParams.tab = slug
        }
        commonScripts.setURLParams({...requestParams})
        storeTable.getData(null, slug, store, type)
    },

    // Создание фильтра
    async createFilter(data, slug, trashed = false, store) {
        let localStore = store.objects[slug]
        let response = await api.callMethod("POST", `filters/${slug}${trashed ? '?trashed=1' : ''}`, {
            title: data.title,
            fields: data.fields
        });

        data.id = response.id
        localStore.filter.savedFields.push(data)
    },

    // Обновление фильтра
    async updateFilter(data, slug, trashed = false) {
        await api.callMethod("PUT", `filters/${slug}/${data.id}${trashed ? '?trashed=1' : ''}`, {
            title: data.title,
            fields: data.fields
        });
    },

    // Удалить фильтр
    async deleteFilter(data, slug, trashed = false) {
        await api.callMethod("DELETE", `filters/${slug}/${data}${trashed ? '?trashed=1' : ''}`);
    },

    // Перемещение фильтров
    async changeOrderFilters(data, slug, trashed = false) {
        await api.callMethod("POST", `filters/${slug}/change-sort${trashed ? '?trashed=1' : ''}`, {
            items: data
        })
    }
}
