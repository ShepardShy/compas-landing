// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	app: {
		cdnURL: "https://compas.pro/landing/",
		head: {
			viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
			link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
		},
	},
	spaLoadingTemplate: false,
	ssr: false,
	modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "nuxt-lodash", "dayjs-nuxt"],
	vite: {
		mode: "production",
		server: {
			fs: {
				allow: ["C:/node_modules/ufo/dist", "C:/node_modules/defu/dist"],
			},
			hmr: {
				clientPort: 3000,
			},
		},
	},
	build: {
		extend(config, ctx) {
			config.resolve.alias["vue$"] = "vue/dist/vue.esm.js";
		},
	},
	render: {
		bundleRenderer: {
			shouldPrefetch: () => false,
			shouldPreload: () => false,
		},
	},
});
