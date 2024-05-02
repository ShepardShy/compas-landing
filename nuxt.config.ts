// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  app: {
      head: {
          viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
      }
  },
  spaLoadingTemplate: false,
  ssr: false,
  modules: [
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt',
      'nuxt-lodash'
  ],
  vite: {
      mode: 'production',
      server: {
          fs: {
              allow: ["C:/node_modules/ufo/dist", "C:/node_modules/defu/dist"]
          }
      }
  },
  build: {
      extend(config, ctx) {
          config.resolve.alias["vue$"] = "vue/dist/vue.esm.js"
      }
  },
  render: {
      bundleRenderer: {
          shouldPrefetch: () => false,
          shouldPreload: () => false,
      },
  }
})
