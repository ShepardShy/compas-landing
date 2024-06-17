import { defineStore } from 'pinia'

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
    }
})
