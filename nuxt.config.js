// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			baseURL: "https://compas.pro/",
		},
	},

	nitro: {
		prerender: {
			crawlLinks: true,
			routes: ["/sitemap.xml", "/sitemap_articles.xml", "/robots.txt"],
		},
	},

	hooks: {
		async "prerender:routes"(ctx) {
			ctx.routes.add(`/articles/poriadok-obzhalovnia-shtrafov-gidbdd`);
		},
	},

	app: {
		cdnURL: "https://compas.pro/landing/",
		head: {
			viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
			link: [{ rel: "icon", type: "image/svg+xml", href: "/landing/favicon.svg" }],
		},
	},
	spaLoadingTemplate: true,
	ssr: true,
	experimental: {
		asyncContext: true,
		inlineRouteRules: true,
	},
	modules: ["nuxt-yandex-metrika", "@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "nuxt-lodash", "dayjs-nuxt"],
	yandexMetrika: {
		id: "98290837",
		options: {
			clickmap: true,
			trackLinks: true,
			accurateTrackBounce: true,
			webvisor: true,
		},
	},
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
