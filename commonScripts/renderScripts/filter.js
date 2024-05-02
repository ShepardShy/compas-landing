import { defineAsyncComponent, markRaw } from 'vue';

export default {
    // Установка компонентов для рендеринга
    async renderElements(fields) {
        let data = []

        for (let field of fields) {
            field.value = null

            if (['actions', 'checkbox', 'json'].includes(field.type) || field.key == 'products') {
                continue
            } else {
                field.component = await this.setComponent(field)
                data.push(field)
            }
        }

        return data
    },

    // Установка компонентов
    async setComponent(field) {
        switch (field.type) {
            case 'status':
                return markRaw(defineAsyncComponent(() => import('@/components/AppSelects/Status/Status.vue')))
            case 'select_dropdown':
                return markRaw(defineAsyncComponent(() => import('@/components/AppSelects/Select/Select.vue')))
            case 'relation':
                return markRaw(defineAsyncComponent(() => import('@/components/AppAutocomplete/Input.vue')))
            case 'date':
                return markRaw(defineAsyncComponent(() => import('@/components/AppInputs/Date/Date.vue')))
            default:
                return markRaw(defineAsyncComponent(() => import('@/components/AppInputs/Input/Input.vue')))
        }
    }
}