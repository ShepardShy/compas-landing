import { defineStore } from 'pinia'
import api from '@/helpers/api.js'

export const useCommonStore = defineStore('commonStore', {
    // states
    state: () =>  {
        return {
            menu: [],
            activeTab: null,
            tabs: [],
            updatedMethods: {},
            modalInfo: [],
        }
    },

    persist: {
        storage: persistedState.localStorage,
    },

    // actions
    actions: {
        // Обновление меню
        async getMenu() {
            let response = await api.callMethod("GET", `sidebar/get`);
            this.menu = response
        },

        // Обновление меню
        async updateMenu(data) {
            await api.callMethod("POST", `sidebar/set${data.role == 'all' ? '/all' : data.role == 'myself' ? '' :  '/' + data.role}`, {
                menu: data.fields
            });
        }
    }
})
