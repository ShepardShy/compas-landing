import api from '~/helpers/api'

import { useTableStore } from '~/stores/tableStore'

export default {

    // Создание категории
    async createCategory(category, slug, route) {
        const tableStore = useTableStore()
        await api.callMethod("POST", `${slug}/categories`, category)
        tableStore.getData(slug, route)
    },

    // Обновление категории
    async updateCategory(category, slug, route) {
        const tableStore = useTableStore()
        await api.callMethod("PUT", `${slug}/categories/${category.id}`, category)
        tableStore.getData(slug, route)
    },

    // Удаление категории
    async deleteCategory(id, slug, route) {
        const tableStore = useTableStore()
        await api.callMethod("DELETE", `${slug}/categories/${id}`)
        tableStore.getData(slug, route)
    }
}