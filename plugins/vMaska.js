import { vMaska } from "maska"
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('maska', vMaska)
    return 
})