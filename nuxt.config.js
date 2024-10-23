// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			baseURL: "https://compas.pro/",
		},
	},

	hooks: {
		async "prerender:routes"(ctx) {
			const res = await fetch("https://compas.pro/api/pages");
			let pages = await res.json();
			pages = pages.map((i) => i.replace("https://compas.pro", "")).filter((i) => i);

			// Добавляем маршруты на основе данных из API
			pages.forEach((page) => {
				ctx.routes.add(page);
			});
		},
	},
	generate: {
		fallback: true,
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
